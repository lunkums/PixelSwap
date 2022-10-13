function readSingleFile(evt) {
  //Retrieve the first (and only!) File from the FileList object
  let f = evt.target.files[0];

  if (f) {
    let r = new FileReader();
    r.onload = function (e) {
      let contents = e.target.result;
      alert(
        "Got the file.\n" +
          "name: " +
          f.name +
          "\n" +
          "type: " +
          getFileType(f.name) +
          "\n" +
          "size: " +
          f.size +
          " bytes\n" +
          "starts with: " +
          contents.substr(0, contents.indexOf("\n"))
      );
      document.getElementById("area").value = contents;
    };
    r.readAsText(f);
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
