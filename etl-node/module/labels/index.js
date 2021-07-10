const fs = require('fs');
const { RekognitionClient, DetectLabelsCommand } = require("@aws-sdk/client-rekognition");
const mapSeries = require('async/mapSeries');
const debug = require('debug')('app')

const { updateLabel, saveImageLabels } = require('../post/label')
const { getFileList, postsPath, moveFile } = require('../../support/folder')
const { openDB } = require('../../support/database')

const client = new RekognitionClient({ region: "us-west-2" });


function getLabelsFromImage(file) {
  debug('rekognition call...')
  const imageData = fs.readFileSync(file);
  const params = {
    Image: {
      Bytes: imageData,
    },
    MaxLabels: 21,
  };

  const command = new DetectLabelsCommand(params);

  return new Promise((resolve) => {
    client.send(command).then(
      (data) => resolve(data),
      (error) => resolve(error)
    );
  })
}

function getLabel(labels) {
  if (!labels || !Array.isArray(labels.Labels) || !labels.Labels.length) {
    return 'error'
  }

  const isFood = !!labels.Labels.find(({Name}) => Name === 'Food')
  const isDrink = !!labels.Labels.find(({Name}) => Name === 'Beverage') || !!labels.Labels.find(({Name}) => Name === 'Drink')

  const isPizza = !!labels.Labels.find(({Name}) => Name === 'Pizza')
  const isSushi = !!labels.Labels.find(({Name}) => Name === 'Sushi')

  const isDessert = !!labels.Labels.find(({Name}) => Name === 'Dessert') || !!labels.Labels.find(({Name}) => Name === 'Sweets')


  if (isPizza) {
    return 'pizza'
  }

  if (isSushi) {
    return 'sushi'
  }

  if (isDrink) {
    return 'drink'
  }

  if (isDessert) {
    return 'dessert'
  }

  if (isFood) {
    return 'food'
  }

  return 'no_food'
}

async function waiter(secondsToWait) {
  return new Promise((resolve) => {
    setInterval(() => {
      resolve();
    }, secondsToWait);
  });
}

async function main() {
  debug('starting labels extraction...')

  await openDB()
  debug('DB opened')

  const files = await getFileList()
  if (!files || !Array.isArray(files) || !files.length) {
    debug('no files found :(')
  }
  debug(`files found: ${files.length}\n`)
  
  await mapSeries(files.slice(0, 10), async (fileName) => {
    debug(fileName.split('.')[0])

    const labelsFromImage = await getLabelsFromImage(`${postsPath}/${fileName}`)

    const label = getLabel(labelsFromImage)

    await updateLabel(label, fileName)
    await moveFile(label, fileName)

    const postId = fileName.split('.')[0]
    await saveImageLabels(postId, labelsFromImage.Labels)

    debug(`${label}:${labelsFromImage.Labels.length}`)

    await waiter(1000)
    debug('')
  })
}

main().then(() => {
  process.exit(0)
})
