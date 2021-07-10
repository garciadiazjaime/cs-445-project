const { Post, PostLabel } = require('./model')

async function updateLabel(label, image) {
  const id = image.split('.')[0]

  return Post.findOneAndUpdate({ id }, { label }, {
    new: true,
    upsert: true,
  })
}

function saveImageLabels(postId, labels) {
  return PostLabel.findOneAndUpdate({ postId }, { labels }, {
    new: true,
    upsert: true,
  })
}

module.exports = {
  updateLabel,
  saveImageLabels,
}
