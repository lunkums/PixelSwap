const min = 0;
const max = 255;

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

class Color {
  constructor(red, green, blue, name) {
    this.red = clamp(red, min, max);
    this.green = clamp(green, min, max);
    this.blue = clamp(blue, min, max);
    this.name = name;
  }

  print() {
    console.log(`${name} = (R:${this.red}, G:${this.green}, B:${this.blue})`);
  }

  difference(color) {
    return Math.sqrt(
      (this.red - color.red) ** 2 +
        (this.green - color.green) ** 2 +
        (this.blue - color.blue) ** 2
    );
  }
}
