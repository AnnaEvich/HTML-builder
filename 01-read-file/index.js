
const fs = require('fs');
const path = require('path');
const sourcePath = path.join(__dirname, 'text.txt')
const readableStream  = fs.createReadStream(sourcePath,  'utf-8')
const data = [ ]

readableStream.on('data', (chunk) => {
  data.push(chunk)
})

readableStream.on('end', () => {
  console.log(data.join(''))
})
console.log(readableStream)




