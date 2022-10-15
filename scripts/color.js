const matchingMethodSelector = document.getElementById("matching-method");
matchingMethodSelector.onchange = (e) => {
  Color.matchingMethod = e.target.value;
};

const min = 0;
const max = 255;

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const MatchingMethods = {
  CIELAB: "CIELAB",
  Weighted: "Weighted",
  EuclideanDistance: "EuclideanDistance",
};

class Color {
  static matchingMethod = matchingMethodSelector.value;

  constructor(red, green, blue, name = "Unnamed") {
    this.red = clamp(red, min, max);
    this.green = clamp(green, min, max);
    this.blue = clamp(blue, min, max);
    this.name = name;
  }

  static xyzToCIE(xyz) {
    // Based on Observer: 2° (CIE 1931), Illuminant: D50
    let x = xyz[0] / 96.422;
    let y = xyz[1] / 100.0;
    let z = xyz[2] / 82.521;

    if (x > 0.008856) x = x ** (1 / 3);
    else x = 7.787 * x + 16 / 116;
    if (y > 0.008856) y = y ** (1 / 3);
    else y = 7.787 * y + 16 / 116;
    if (z > 0.008856) z = z ** (1 / 3);
    else z = 7.787 * z + 16 / 116;

    let L = 116 * y - 16;
    let a = 500 * (x - y);
    let b = 200 * (y - z);
    return [L, a, b];
  }

  toXYZ() {
    let r = this.red / max;
    let g = this.green / max;
    let b = this.blue / max;

    if (r > 0.04045) r = ((r + 0.055) / 1.055) ** 2.4;
    else r = r / 12.92;
    if (g > 0.04045) g = ((g + 0.055) / 1.055) ** 2.4;
    else g = g / 12.92;
    if (b > 0.04045) b = ((b + 0.055) / 1.055) ** 2.4;
    else b = b / 12.92;

    r = r * 100;
    g = g * 100;
    b = b * 100;

    let X = r * 0.4124 + g * 0.3576 + b * 0.1805;
    let Y = r * 0.2126 + g * 0.7152 + b * 0.0722;
    let Z = r * 0.0193 + g * 0.1192 + b * 0.9505;
    return [X, Y, Z];
  }

  toCIE() {
    return Color.xyzToCIE(this.toXYZ());
  }

  difference(color) {
    if (Color.matchingMethod === MatchingMethods.CIELAB) {
      return this.#cielab(color);
    } else if (Color.matchingMethod === MatchingMethods.Weighted) {
      return this.#weighted(color);
    } else if (Color.matchingMethod === MatchingMethods.EuclideanDistance) {
      return this.#euclideanDistance(color);
    }
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

  #cielab(color) {
    let myCIE = this.toCIE();
    let otherCIE = color.toCIE();
    return Math.sqrt(
      (myCIE[0] - otherCIE[0]) ** 2 +
        (myCIE[1] - otherCIE[1]) ** 2 +
        (myCIE[2] - otherCIE[2]) ** 2
    );
  }

  #weighted(color) {
    return (
      0.3 * (this.red - color.red) ** 2 +
      0.59 * (this.green - color.green) ** 2 +
      0.11 * (this.blue - color.blue) ** 2
    );
  }

  #euclideanDistance(color) {
    return Math.sqrt(
      (this.red - color.red) ** 2 +
        (this.green - color.green) ** 2 +
        (this.blue - color.blue) ** 2
    );
  }
}
