const fs = require('fs');
const path = require('path');

const readableStream = fs.createWriteStream(path.join(__dirname, '\\project-dist\\bundle.css'), 'utf-8');
const styleNewArr = [];

async function readFiles() {
  fs.unlink(path.join(__dirname, '\\project-dist\\bundle.css'), () => {
    const readFileInfo = fs.promises.readdir(path.join(__dirname, '.\\styles'),
        {withFileTypes: true});
    readFileInfo.then(files => {
      for (let elem of files) {
        const mainPath = path.join(path.join(__dirname, '\\styles'), '\\',
            elem['name']);
        if (path.join(__dirname, "styles", path.basename(path.join(__dirname, "styles", mainPath))).includes(".css")) {
          const doneRead = fs.createReadStream(mainPath, 'utf-8');
          doneRead.on('data', data => {
            styleNewArr.push(data);
          });
          doneRead.on('end', () => {
            readableStream.write(styleNewArr.flat().join('\n'), 'utf-8');
          });
        }
      }
    });
  });
}

readFiles();

