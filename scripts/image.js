const imageOld = document.getElementById("image-old");
const imageCanvas = document.getElementById("image-canvas");
const imagePreview = document.getElementById("image-preview");
const imageInput = document.getElementById("image-input");
imageInput.addEventListener("change", readSingleFile, false);
palettePreview.addEventListener("change", updatePreviewImage, false);

// Update the image preview when the palette changes
observer = new MutationObserver(updatePreviewImage);
observer.observe(palettePreview, { childList: true });

let image = "";

function readSingleFile(e) {
  //Retrieve the first (and only!) File from the FileList object
  let file = e.target.files[0];

  if (file) {
    let reader = new FileReader();
    reader.onload = (event) => {
      if (isValidPng(file)) {
        image = event.target.result;
        updatePreviewImage();
      } else {
        e.target.value = null;
        resetImage();
        alert("Not a valid PNG file!");
      }
    };
    reader.readAsDataURL(file);
  } else {
    resetImage();
    alert("Failed to load file");
  }
}

function updatePreviewImage() {
  // Manually clear the preview because the image won't technically "load" if
  // it's just being cleared, thus onload events won't be called
  if (!image) {
    imagePreview.src = "";
  }
  // Must wait until the image loads or you won't be able to load the image data
  imageOld.onload = () => {
    if (image && palette.length !== 0) {
      dyeImage(imageOld);
    }
  };
  imageOld.src = image;

  imagePreview.hidden = !image || palette.length === 0;
  imageOld.hidden = !image;
}

function resetImage() {
  image = "";
  updatePreviewImage();
}

function dyeImage(image) {
  // Must grab the canvas as is needed so the image can load first
  const width = image.width || image.naturalWidth;
  const height = image.height || image.naturalHeight;
  imageCanvas.width = width;
  imageCanvas.height = height;
  let context = imageCanvas.getContext("2d");

  context.drawImage(image, 0, 0);

  let imageData = context.getImageData(0, 0, width, height),
    pix = imageData.data;

  // Loop through all of the pixels and modify the components
  for (let i = 0, n = pix.length; i < n; i += 4) {
    let pixelColor = new Color(pix[i], pix[i + 1], pix[i + 2]);
    let newColor = getMostSimilarColor(pixelColor).colorArray;
    pix[i] = newColor[0]; // Red component
    pix[i + 1] = newColor[1]; // Blue component
    pix[i + 2] = newColor[2]; // Green component
    //pix[i+3] is the transparency.
  }

  context.putImageData(imageData, 0, 0);

  imagePreview.src = imageCanvas.toDataURL("image/png");
}
