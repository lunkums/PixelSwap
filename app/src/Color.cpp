#include <cmath>
#include "Color.h"

MatchingMethod Color::matchingMethod = MatchingMethod::Euclidean;

float Color::EuclideanDistance(Color& color)
{
    return sqrtf(
        powf(channels[0] - color.channels[0], 2) +
        powf(channels[1] - color.channels[1], 2) +
        powf(channels[2] - color.channels[2], 2)
    );
}

float Color::WeightedRGB(Color& color)
{
    return sqrtf(
        0.3f * powf(channels[0] - color.channels[0], 2) +
        0.59f * powf(channels[1] - color.channels[1], 2) +
        0.11f * powf(channels[2] - color.channels[2], 2)
    );
}

float Color::Cielab(Color& color)
{
    CIE myCIE = ToCIE();
    CIE otherCIE = color.ToCIE();
    return sqrtf(
        powf(myCIE.L - otherCIE.L, 2) +
        powf(myCIE.a - otherCIE.a, 2) +
        powf(myCIE.b - otherCIE.b, 2)
    );
}

uint8_t Color::operator [](int i) const
{
    return channels[i];
}

Color::Color(uint8_t red, uint8_t green, uint8_t blue)
{
    channels[0] = red;
    channels[1] = green;
    channels[2] = blue;

    // Uninitialized values of CIE and XYZ are expressed as all -1's
    xyz = { -1, -1, -1 };
    cie = { -1, -1, -1 };
}

XYZ& Color::ToXYZ()
{
    // XYZ values should be all non-negative, otherwise the struct is uninitialized
    if (xyz.x < 0 || xyz.y < 0 || xyz.z < 0)
    {
        float r = channels[0] / 255.0f;
        float g = channels[1] / 255.0f;
        float b = channels[2] / 255.0f;

        if (r > 0.04045f) r = powf(((r + 0.055f) / 1.055f), 2.4f);
        else r = r / 12.92f;
        if (g > 0.04045f) g = powf(((g + 0.055f) / 1.055f), 2.4f);
        else g = g / 12.92f;
        if (b > 0.04045f) b = powf(((b + 0.055f) / 1.055f), 2.4f);
        else b = b / 12.92f;

        r = r * 100;
        g = g * 100;
        b = b * 100;

        xyz.x = r * 0.4124f + g * 0.3576f + b * 0.1805f;
        xyz.y = r * 0.2126f + g * 0.7152f + b * 0.0722f;
        xyz.z = r * 0.0193f + g * 0.1192f + b * 0.9505f;

        return xyz;
    }
    return xyz;
}

CIE& Color::ToCIE()
{
    // L value should be non-negative, otherwise the struct is uninitialized
    if (cie.L < 0)
    {
        cie = XYZToCIE(ToXYZ());
    }
    return cie;
}

float Color::Difference(Color& color)
{
    if (matchingMethod == MatchingMethod::Euclidean)
    {
        return EuclideanDistance(color);
    }
    else if (matchingMethod == MatchingMethod::Weighted)
    {
        return WeightedRGB(color);
    }
    else if (matchingMethod == MatchingMethod::CIELAB)
    {
        return Cielab(color);
    }
    return -1;
}

std::string Color::ToString()
{
    return "rgb(" + std::to_string(channels[0]) + ", "
        + std::to_string(channels[1]) + ", "
        + std::to_string(channels[2]) + ")";
}

CIE Color::XYZToCIE(XYZ& xyz)
{
    // Based on Observer: 2� (CIE 1931), Illuminant: D50
    float x = xyz.x / 96.422f;
    float y = xyz.y / 100.0f;
    float z = xyz.z / 82.521f;

    if (x > 0.008856f) x = powf(x, (1 / 3.0f));
    else x = 7.787f * x + 16 / 116.0f;
    if (y > 0.008856f) y = powf(y, (1 / 3.0f));
    else y = 7.787f * y + 16 / 116.0f;
    if (z > 0.008856f) z = powf(z, (1 / 3.0f));
    else z = 7.787f * z + 16 / 116.0f;

    float L = 116 * y - 16;
    float a = 500 * (x - y);
    float b = 200 * (y - z);

    return { L, a, b };
}

void Color::SetMatchingMethod(const char* method)
{
    std::string euclidean("Euclidean");
    std::string weighted("Weighted");
    std::string cielab("CIELAB");

    if (euclidean.compare(method) == 0)
    {
        matchingMethod = MatchingMethod::Euclidean;
    }
    else if (weighted.compare(method) == 0)
    {
        matchingMethod = MatchingMethod::Weighted;
    }
    else if (cielab.compare(method) == 0)
    {
        matchingMethod = MatchingMethod::CIELAB;
    }
}