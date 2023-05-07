const fs = require('fs')
const path = require('path')

fs.access(__dirname + '\\files-copy', fs.constants.F_OK, (err) => {
  if (err)
    fs.mkdir(__dirname + '\\files-copy', err => {
      if (err) {
        throw err
      }
      console.log('new folder is ready!')
    })
  else {
    console.log ('FILE ALREADY EXIST!!!')

  }
})

fs.readdir(path.join(__dirname, 'files'), (err, files) => {
  if (err){
    throw err
  }
  files.forEach(elem => {
    fs.copyFile(path.join(__dirname, 'files', elem), path.join(__dirname, 'files-copy', elem), (err) => {
      if (err) {
        throw err
      }
    })
  })
})


