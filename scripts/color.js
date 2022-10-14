const min = 0;
const max = 255;

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

class Color {
  constructor(red, green, blue, name = "Unnamed") {
    this.red = clamp(red, min, max);
    this.green = clamp(green, min, max);
    this.blue = clamp(blue, min, max);
    this.name = name;
  }

  print() {
    console.log(`RGB (${this.red} ${this.green} ${this.blue}) ${this.name}`);
  }

  difference(color) {
    return Math.sqrt(
      (this.red - color.red) ** 2 +
        (this.green - color.green) ** 2 +
        (this.blue - color.blue) ** 2
    );
  }

  get colorArray() {
    return [this.red, this.green, this.blue];
  }

  get cssColor() {
    return `rgb(${this.red}, ${this.green}, ${this.blue})`;
  }

  get isLight() {
    return this.red * 0.299 + this.green * 0.587 + this.blue * 0.114 > 154;
  }
}
