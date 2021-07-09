const { Post, PostLabel } = require('./model')

async function updateLabel(category, image) {
  const id = image.split('.')[0]

  const item = await Post.findOne({ id })
  item.label = category
  return item.save()
}

async function updateIsFood(isFood, imageName) {
  const id = imageName.split('.')[0]

  const item = await Post.findOne({ id })
  item.isFood = isFood

  return item.save()
}

function saveLabels(postId, labels) {
  return PostLabel.findOneAndUpdate({ postId }, { labels }, {
    new: true,
    upsert: true,
  })
}

module.exports = {
  updateLabel,
  updateIsFood,
  saveLabels,
}
