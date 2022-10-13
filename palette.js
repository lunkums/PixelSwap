const palettePreview = document.getElementById("area");
const paletteInput = document.getElementById("palette-input");
paletteInput.addEventListener("change", readSingleFile, false);

let paletteFileContents = "";
let palette = [];

function readSingleFile(e) {
  //Retrieve the first (and only!) File from the FileList object
  let file = e.target.files[0];

  if (file) {
    let reader = new FileReader();
    reader.onload = (event) => {
      if (isValidGpl(file)) {
        paletteFileContents = event.target.result;
        updatePreviewText();
        palette = parseGplFile(paletteFileContents);
      } else {
        e.target.value = null;
        resetPalette();
        alert("Not a valid GPL file!");
      }
    };
    reader.readAsText(file);
  } else {
    resetPalette();
    alert("Failed to load file");
  }
}

function updatePreviewText() {
  palettePreview.innerText = paletteFileContents;
}

function resetPalette() {
  paletteFileContents = "";
  palette = [];
  updatePreviewText();
}
