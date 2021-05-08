const debug = require('debug')('app')

const { Post } = require('../post/model')
const { dowloadImageFrom } = require('../post/images')
const { openDB } = require('../../support/database')
const { getImagesFromFolder } = require('../../support/folder')

const folders = ['delete', 'dessert', 'drink', 'none', 'pizza', 'posts', 'sandwich', 'seafood', 'tacos']

async function getLocalImageList() {
  const images = []
  const promises = folders.map(async (folder) => {
    const response = await getImagesFromFolder(`images/${folder}`)
    images.push(...response)
  })

  await Promise.all(promises)

  return images
}

function getPosts(limit = 100) {
  const since = new Date()
  since.setDate(since.getDate() - 30)

  return Post.aggregate([{
    $match: {
        $or: [
          {
            source: 'chicagofood'
          },
          {
            source: 'tijuanamakesmehungry'
          },
          {
            source: 'tijuanafood'
          },
        ],
        mediaType: {
          $nin: ['GraphVideo', 'GraphSidecar']
        },
        createdAt: {
          $gt: since
        }
      },
    },
    {
      $sort: {
        createdAt: -1
      },
    },
    {
      $limit: limit
    },
  ])
}

function getNewPosts(ids, posts) {
  const idTaken = ids.reduce((accu, id) => {
    accu[id] = true
    return accu
  }, {})

  return posts.filter(post => !idTaken[post.id])
}

async function main() {
  await openDB()
  debug('DB open')

  const images = await getLocalImageList()
  const ids = images.map(image => image.split('.')[0])
  debug(`images: ${ids.length}`)

  const posts = await getPosts(7000)
  debug(`posts: ${posts.length}`)

  const newPosts = getNewPosts(ids, posts)
  debug(`newPosts: ${newPosts.length}`)

  await dowloadImageFrom(newPosts)
}


main().then(() => {
  debug('END')
  process.exit(0)
})
