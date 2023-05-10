const fs = require('fs');
const path = require('path');
const process = require('node:process');


const input = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');
const {stdin, stdout} = process;

console.log('Enter text:');
stdin.on('data', data => {
  let result = data.toString().trim();
  if (result === 'exit') {
    process.exit();
  } else {
    input.write(data, 'utf-8');
  }
});

process.addListener('SIGINT', () => {
  process.exit();
});
process.addListener('exit', () => {
  console.log('\nHave a nice day');
});