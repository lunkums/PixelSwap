#pragma once
#include <string>

struct XYZ
{
    float x;
    float y;
    float z;
};

struct CIE
{
    float L;
    float a;
    float b;
};

enum class MatchingMethod
{
    Euclidean,
    Weighted,
    CIELAB
};

class Color
{
private:
    uint8_t channels[3];

    XYZ xyz;
    CIE cie;

    float EuclideanDistance(Color& color);
    float WeightedRGB(Color& color);
    float Cielab(Color& color);

    static MatchingMethod matchingMethod;
public:
    uint8_t operator [](int i) const;

    Color(uint8_t red, uint8_t green, uint8_t blue);

    XYZ& ToXYZ();
    CIE& ToCIE();

    float Difference(Color& color);

    std::string ToString();

    static CIE XYZToCIE(XYZ& xyz);
    static void SetMatchingMethod(const char* method);
};
