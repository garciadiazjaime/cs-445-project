const fs = require('fs');
const { RekognitionClient, DetectLabelsCommand } = require("@aws-sdk/client-rekognition");
const mapSeries = require('async/mapSeries');
const debug = require('debug')('app')

const { updateIsFood, saveLabels } = require('../post/label')
const { getFileList, postsPath, moveFile } = require('../../support/folder')
const { openDB } = require('../../support/database')

const client = new RekognitionClient({ region: "us-west-2" });


function getLabels(file) {
  debug('file', file)

  debug('rekognition call...', file)
  const imageData = fs.readFileSync(file);
  const params = {
    Image: {
      Bytes: imageData,
    },
    MaxLabels: 10, 
  };

  const command = new DetectLabelsCommand(params);

  return new Promise((resolve) => {
    client.send(command).then(
      (data) => resolve(data),
      (error) => resolve(error)
    );
  })
}

function getIsFood(labels) {
  return labels && Array.isArray(labels.Labels) && labels.Labels.length && !!labels.Labels.find(({Name}) => Name === 'Food')
}

async function main() {
  debug('starting labels extraction...')

  await openDB()
  debug('DB opened')

  const files = await getFileList()
  if (!files || !Array.isArray(files) || !files.length) {
    debug('no files found :(')
  }
  debug(`files found: ${files.length}`)
  
  await mapSeries(files.slice(0, 1), async (fileName) => {
    const labels = await getLabels(`${postsPath}/${fileName}`)

    const isFood = getIsFood(labels) 

    await updateIsFood(isFood, fileName)

    const folder = isFood ? 'food' : 'no_food'
    await moveFile(folder, fileName)
    debug(`${fileName}:${folder}`)

    const postId = fileName.split('.')[0]
    await saveLabels(postId, labels.Labels)
    debug(`${fileName}:labels:${labels.Labels.length}`)
  })
}

main().then(() => {
  process.exit(0)
})
