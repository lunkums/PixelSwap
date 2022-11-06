const beforeImage = document.getElementById("before-image");
const beforeImagePreview = document.getElementById("before-image-preview");
const beforeDiv = document.getElementById("before");
const afterImage = document.getElementById("after-image");
const afterImagePreview = document.getElementById("after-image-preview");
const afterDiv = document.getElementById("after");
const imageInput = document.getElementById("image-input");
const downloadButtons = document.getElementsByClassName("download-button");
const imageDownload = document.getElementById("image-download");

imageInput.addEventListener("change", readSingleFile);
palettePreview.addEventListener("change", updatePreviewImages);
matchingMethodSelector.addEventListener("change", updatePreviewImages);

// Update the image preview when the palette changes
observer = new MutationObserver(updatePreviewImages);
observer.observe(palettePreview, { childList: true });

let image = "";

// Do not initialize until the WebAssembly module has been loaded or _malloc
// will not be defined
Module.onRuntimeInitialized = () => initializePreviewImages();

function readSingleFile(e) {
  //Retrieve the first (and only!) File from the FileList object
  let file = e.target.files[0];

  if (file) {
    let reader = new FileReader();
    reader.onload = (event) => {
      if (isValidPng(file)) {
        image = event.target.result;
        updatePreviewImages();
      } else {
        e.target.value = null;
        alert("Not a valid PNG file!");
      }
    };
    reader.readAsDataURL(file);
  }
}

function initializePreviewImages() {
  beforeImage.crossOrigin = "Anonymous";
  image = beforeImage.src;
  updatePreviewImages();
}

function updatePreviewImages() {
  // Must wait until the image loads or you won't be able to load the image data
  beforeImage.onload = () => {
    updateBeforeImagePreview(beforeImage);
    updateAfterImagePreview(beforeImage);
  };
  beforeImage.src = image;

  beforeDiv.hidden = !image;
  afterDiv.hidden = !image || palette.length === 0;
  Array.from(downloadButtons).forEach((button) => {
    button.hidden = afterDiv.hidden;
  });
}

function updateAfterImagePreview(image) {
  const width = image.width || image.naturalWidth;
  const height = image.height || image.naturalHeight;
  afterImagePreview.width = width;
  afterImagePreview.height = height;
  let context = afterImagePreview.getContext("2d", {
    willReadFrequently: true,
  });

  context.drawImage(image, 0, 0);

  let imageData = context.getImageData(0, 0, width, height),
    pixels = imageData.data;

  /* BEGIN WEBASSEMBLY CODE */

  let pixelBuffer = Module._malloc(
    pixels.length * Uint8Array.BYTES_PER_ELEMENT
  );
  Module.HEAPU8.set(pixels, pixelBuffer);
  Module.ccall(
    "SwapColors",
    null,
    ["string", "array", "number", "number", "number"],
    [ColorMatchingMethod, palette, palette.length, pixelBuffer, pixels.length]
  );

  let convertedImage = new Uint8ClampedArray(
    Module.HEAPU8.buffer,
    pixelBuffer,
    pixels.length
  );

  Module._free(pixelBuffer);

  /* END WEBASSEMBLY CODE */

  context.putImageData(new ImageData(convertedImage, width, height), 0, 0);

  afterImage.src = afterImagePreview.toDataURL("image/png");
  afterImagePreview.href = afterImage.src;
  Array.from(downloadButtons).forEach((button) => {
    button.href = afterImage.src;
  });
  imageDownload.href = afterImage.src;
}

function updateBeforeImagePreview(image) {
  const width = image.width || image.naturalWidth;
  const height = image.height || image.naturalHeight;
  beforeImagePreview.width = width;
  beforeImagePreview.height = height;
  let context = beforeImagePreview.getContext("2d", {
    willReadFrequently: true,
  });

  context.drawImage(image, 0, 0);

  let imageData = context.getImageData(0, 0, width, height);

  context.putImageData(imageData, 0, 0);
}
