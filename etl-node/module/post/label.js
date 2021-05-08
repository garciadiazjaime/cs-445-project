const { Post } = require('./model')

async function updateLabel(category, image) {
  const id = image.split('.')[0]

  const item = await Post.findOne({ id })
  item.label = category
  return item.save()
}

module.exports = {
  updateLabel
}
