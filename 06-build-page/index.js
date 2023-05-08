const fs = require('fs');
const path = require('path');

async function copyDirectory(directoryPath, copyDirectoryPath) {
  if (!directoryPath || !copyDirectoryPath) {
    return;
  }

  fs.mkdir(path.join(copyDirectoryPath), {recursive: true}, () => {
   let readCopy = fs.promises.readdir(path.join(directoryPath), {withFileTypes: true})
   readCopy.then(files => files.forEach(element => {
      if (element.isDirectory()) {
        copyDirectory(path.join(directoryPath, '\\', element.name), path.join(copyDirectoryPath, '\\', element.name));
      } else if (element.isFile()) {
        fs.promises.copyFile(path.join(directoryPath, '\\', element.name), path.join(copyDirectoryPath, '\\', element.name));
      }
    }));
  });
}

async function cleanDirectory(folderPath) {
  if (!folderPath) {
    return;
  }

  let elementList = await fs.promises.readdir(folderPath, {withFileTypes: true});
  if (elementList.length > 0) {
    for (let element of elementList) {
      if (element.isFile()) {
        await fs.promises.unlink(path.join(folderPath, element.name));
      } else if (element.isDirectory()) {
        await cleanDirectory(path.join(folderPath, element.name));
      }
    }
  }

  await fs.promises.rmdir(folderPath);
}

async function create() {
  let projectDist = path.join(__dirname, '\\project-dist');

  await cleanDirectory(path.join(__dirname, '\\project-dist\\'));
  await fs.promises.mkdir(projectDist, {recursive: true});
  await copyDirectory(path.join(__dirname, '\\assets'), path.join(projectDist, '\\assets'));

  await createStyle(path.join(__dirname, '\\styles'), path.join(__dirname, '\\project-dist\\style.css'));
  await createHTML(path.join(__dirname, '\\template.html'), path.join(__dirname, '\\components'), path.join(projectDist, '\\index.html'));
}

async function createStyle(sourcePath, resultPath) {
  let style = [];
  let writeStream = fs.createWriteStream(resultPath, 'utf-8');

  fs.promises.readdir(sourcePath, {withFileTypes: true}).then(files => files.forEach(element => {
    if (element['name'].slice(-3) === 'css') {
      let readable = fs.createReadStream(path.join(sourcePath, '\\', element['name']), 'utf-8');

      readable.on('data', data => {
        style.push(data);
      });

      readable.on('end', () => {
        writeStream.write(style.flat().join('\n'), 'utf-8');
      });
    }
  }));
}

async function createHTML(filePath, sourcePath, targetPath) {
  let htmlWrite = fs.createWriteStream(targetPath, 'utf-8');
  let fileList = await fs.promises.readdir(sourcePath, {withFileTypes: true});
  let params = {};

  for (const element of fileList) {
    if (element.name.slice(-4) === 'html') {
      const paramName = element.name.slice(0, -5);
      params[paramName] = (await fs.promises.readFile(path.join(sourcePath, element.name))).toString();
    }
  }

  let result = (await fs.promises.readFile(filePath)).toString();
  Object.keys(params).forEach(key => {
    result = result.replaceAll('{{' + key + '}}', params[key]);
  });

  htmlWrite.write(result, 'utf-8');
}

create();