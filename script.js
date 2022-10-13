function readSingleFile(e) {
  //Retrieve the first (and only!) File from the FileList object
  let file = e.target.files[0];

  if (file) {
    let r = new FileReader();
    r.onload = (event) => {
      let contents = event.target.result;
      alert(
        "Got the file.\n" +
          "name: " +
          file.name +
          "\n" +
          "type: " +
          getFileType(file.name) +
          "\n" +
          "size: " +
          file.size +
          " bytes\n" +
          "starts with: " +
          contents.substr(0, contents.indexOf("\n"))
      );
      document.getElementById("area").innerText = contents;
    };
    r.readAsText(file);
  } else {
    alert("Failed to load file");
  }
}

function getFileType(filename) {
  return filename.split(".").pop();
}

document
  .getElementById("palette-input")
  .addEventListener("change", readSingleFile, false);
