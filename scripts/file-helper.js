function getFileType(filename) {
  return filename.split(".").pop();
}

function isValidPng(file) {
  return getFileType(file.name).toLocaleLowerCase() === "png";
}

function isValidGpl(file) {
  return getFileType(file.name).toLocaleLowerCase() === "gpl";
}

function parseGplFile(file) {
  let lines = file.split(/\r?\n/);
  let palette = [];

  if (lines[0] !== "GIMP Palette") {
    alert("Poorly formatted GPL file!");
    return;
  }

  for (let i = 1; i < lines.length; i++) {
    let line = lines[i];

    // Ignore comments and empty lines
    if (line.length === 0 || line[0] === "#") continue;
    let rgbValues = line.trim().split(/\s+/);

    palette.push(rgbValues[0]);
    palette.push(rgbValues[1]);
    palette.push(rgbValues[2]);
  }

  return new Uint8ClampedArray(palette);
}
