const imageOld = document.getElementById("image-old");
const imagePreview = document.getElementById("image-preview");
const imageInput = document.getElementById("image-input");
imageInput.addEventListener("change", readSingleFile, false);

let image = "";
let previewImage = null;

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
  imageOld.src = image;
  if (imageOld && palette) {
    previewImage = dyeImage(imageOld);
  }
}

function resetImage() {
  image = "";
  updatePreviewImage();
}

function dyeImage() {}
