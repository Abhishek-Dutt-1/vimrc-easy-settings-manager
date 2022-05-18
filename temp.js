// const fs = require('fs')
// const os = require('os')
// const path = require('path')
// p = path.join(os.homedir(), "_vimrc")
// fs.readFile(p, 'utf8', function (err, data) {
//     if (err) return console.log(err);
//     // data is the contents of the text file we just read
//     console.log(data)
// });

function readSingleFile(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {
    var contents = e.target.result;
    displayContents(contents);
  };
  reader.readAsText(file);
}

function displayContents(contents) {
  var element = document.getElementById('file-content');
  element.textContent = contents;
}

document.getElementById('file-input')
  .addEventListener('change', readSingleFile, false);