const fs = require('fs');
const util = require('util');

const readdir = util.promisify(fs.readdir);
const rename = util.promisify(fs.rename);

const directory = '../website/static';

async function getFileList() {
  const response = await readdir(`${directory}/images/posts`)

  return response.slice(0, 500).filter(file => file.includes('jpg'))
}

async function getImagesFromFolder(path) {
  const response = await readdir(`${directory}/${path}`)

  return response.filter(file => file.includes('jpg'))
}

async function moveFile(category, image) {
  const oldPath = `${directory}/posts/${image}`
  const newPath = `${directory}/${category}/${image}`

  await rename(oldPath, newPath)
}

module.exports = {
  getFileList,
  moveFile,
  getImagesFromFolder,
}
