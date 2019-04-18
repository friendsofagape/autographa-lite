var fs = require("fs");
module.exports = {
  recSave: function(book, file, chapter) {
    const path = require("path");
    var appPath = path.join(__dirname, "..", "..");
    var filePath = `${appPath}/recordings/${
      book.bookName
    }/${chapter}/${chapter} ${Date.now()}.webm`;
    fs.exists(`${appPath}/recordings/${book.bookName}/${chapter}`, function(
      exists
    ) {
      if (exists) {
        console.log("Directory Exists");
        filePath = writeRecfile(file, filePath);
        } else {
        fs.exists(`${appPath}/recordings`, function(exists) {
          if (exists) {
            console.log("exists");
          } else fs.mkdirSync(`${appPath}/recordings`);
        });

        fs.exists(`${appPath}/recordings/${book.bookName}`, function(exists) {
          if (exists) {
            console.log("exists");
          } else fs.mkdirSync(`${appPath}/recordings/${book.bookName}`);
        });

        fs.exists(`${appPath}/recordings/${book.bookName}/${chapter}`, function(exists) {
          if (exists) {
            console.log("exists");
          } else fs.mkdirSync(`${appPath}/recordings/${book.bookName}/${chapter}`);
        });
        filePath = writeRecfile(file, filePath);
      }
    });
    return filePath;
  }
};

function writeRecfile(file, filePath) {
  var fileReader = new FileReader();
  fileReader.onload = function() {
    fs.writeFileSync(filePath, Buffer.from(new Uint8Array(this.result)));
  };
  fileReader.readAsArrayBuffer(file.blob);
  return filePath;
}
