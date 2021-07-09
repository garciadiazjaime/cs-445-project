const fs = require('fs');
const util = require('util');

const readdir = util.promisify(fs.readdir);
const rename = util.promisify(fs.rename);

const directory = '../website/static';
const postsPath = `${directory}/images/posts`

async function getFileList() {
  const response = await readdir(postsPath)

  return response.slice(0, 500).filter(file => file.includes('jpg'))
}

async function getImagesFromFolder(path) {
  const response = await readdir(`${directory}/${path}`)

  return response.filter(file => file.includes('jpg'))
}

async function moveFile(category, image) {
  const oldPath = `${directory}/images/posts/${image}`
  const newPath = `${directory}/images/${category}/${image}`

  await rename(oldPath, newPath)
}

module.exports = {
  postsPath,
  getFileList,
  moveFile,
  getImagesFromFolder,
}
