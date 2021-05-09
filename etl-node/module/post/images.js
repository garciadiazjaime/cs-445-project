const fs = require('fs');
const { promisify } = require('util');

const mapSeries = require('async/mapSeries');
const fetch = require('node-fetch');

const debug = require('debug')('app:image')
const streamPipeline = promisify(require('stream').pipeline);

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
} 

async function downloadImage(mediaUrl, imageName, counter) {
  if (fs.existsSync(imageName)) {   
    return null
  }

  debug(mediaUrl)
  await sleep(1000)
  counter.downloads += 1

  return fetch(mediaUrl)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`unexpected response ${res.statusText}`);
      }

      return streamPipeline(res.body, fs.createWriteStream(imageName));
    });
}

async function dowloadImageFrom(posts) {
  const counter = {
    downloads: 0
  }

  await mapSeries(posts.slice(0, 500), async (post) => {

    const { mediaUrl, caption, id } = post

    const imageName = `../website/static/images/posts/${id}.jpg`
    await downloadImage(mediaUrl, imageName, counter)
  })

  debug(`posts: ${posts.length} | images: ${counter.downloads}`)
}

module.exports = {
  dowloadImageFrom
}
