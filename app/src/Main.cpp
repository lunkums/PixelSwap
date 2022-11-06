#include <iostream>
#include <vector>
#include <emscripten/emscripten.h>
#include "Color.h"

#define EXTERN extern "C"

int main(void)
{
    std::cout << "WASM has loaded." << std::endl;
    return 0;
}

void InitializePalette(std::vector<Color>& colors, uint8_t* palette, int paletteLength)
{
    for (int i = 0; i < paletteLength; i += 3)
    {
        colors.push_back(Color(palette[i], palette[i + 1], palette[i + 2]));
    }
}

Color& GetMostSimilarColor(std::vector<Color>& colors, Color& color)
{
    float minDifference = std::numeric_limits<float>::max();
    int indexOfMostSimilar = 0;

    for (int i = 0; i < colors.size(); i++)
    {
        float difference = color.Difference(colors[i]);

        if (difference < minDifference)
        {
            indexOfMostSimilar = i;
            minDifference = difference;
        }
    }

    return colors[indexOfMostSimilar];
}

EXTERN EMSCRIPTEN_KEEPALIVE
void SwapColors(const char* matchingMethod, uint8_t* palette, int paletteLength, uint8_t* image, int imageLength)
{
    Color::SetMatchingMethod(matchingMethod);
    std::vector<Color> colors;

    InitializePalette(colors, palette, paletteLength);

    // Loop through all of the pixels and modify the components
    for (int i = 0; i < imageLength; i += 4)
    {
        Color pixelColor(image[i], image[i + 1], image[i + 2]);
        Color newColor = GetMostSimilarColor(colors, pixelColor);

        image[i] = newColor[0];
        image[i + 1] = newColor[1];
        image[i + 2] = newColor[2];
        // image[i+3] is the transparency.
    }
}