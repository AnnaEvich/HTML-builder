const fs = require('fs').promises;
const path = require('path')

async function main() {
  await findFiles(path.join(__dirname, '\\secret-folder'))
}

async function findFiles(fileCharacters) {
  let items = await fs.readdir(fileCharacters, {withFileTypes: true})
  for (let item of items) {
    if (item.isFile()) {
      let fileAppearance = path.join(fileCharacters, '\\' + item['name'])
      let mainInfo = ''
      mainInfo += (path.parse(fileAppearance))['name'] + ' - '
      mainInfo += (path.parse(fileAppearance))['ext'].slice(1) + ' - '
      let stat = await fs.stat(fileAppearance)
      let size = stat.size
      mainInfo += (size/ 1024).toString() + 'kB'
      console.log(mainInfo);
    }
  }
}

main()
