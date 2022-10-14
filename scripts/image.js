const beforeImage = document.getElementById("before-image");
const beforeImagePreview = document.getElementById("before-image-preview");
const afterImage = document.getElementById("after-image");
const afterImagePreview = document.getElementById("after-image-preview");
const imageInput = document.getElementById("image-input");
const downloadButtons = document.getElementsByClassName("download-button");
const imageDownload = document.getElementById("image-download");

imageInput.addEventListener("change", readSingleFile);
palettePreview.addEventListener("change", updatePreviewImages);

// Update the image preview when the palette changes
observer = new MutationObserver(updatePreviewImages);
observer.observe(palettePreview, { childList: true });

let image = "";
updatePreviewImages();

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

function updatePreviewImages() {
  // Must wait until the image loads or you won't be able to load the image data
  beforeImage.onload = () => {
    updateBeforeImagePreview(beforeImage);
    updateAfterImagePreview(beforeImage);
  };
  beforeImage.src = image;

  beforeImagePreview.hidden = !image;
  afterImagePreview.hidden = !image || palette.length === 0;
  Array.from(downloadButtons).forEach((button) => {
    button.hidden = afterImagePreview.hidden;
  });
}

function updateAfterImagePreview(image) {
  // Must grab the canvas as is needed so the image can load first
  const width = image.width || image.naturalWidth;
  const height = image.height || image.naturalHeight;
  afterImagePreview.width = width;
  afterImagePreview.height = height;
  let context = afterImagePreview.getContext("2d", {
    willReadFrequently: true,
  });

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

  afterImage.src = afterImagePreview.toDataURL("image/png");
  afterImagePreview.href = afterImage.src;
  Array.from(downloadButtons).forEach((button) => {
    button.href = afterImage.src;
  });
  imageDownload.href = afterImage.src;
}

function updateBeforeImagePreview(image) {
  // Must grab the canvas as is needed so the image can load first
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

  beforeImage.src = beforeImagePreview.toDataURL("image/png");
}
