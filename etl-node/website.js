const fs = require('fs');
const debug = require('debug')('app')

const { openDB } = require('./support/database')
const { Post } = require('./module/post/model');
const { getFileList } = require('./support/folder')

function getPosts(limit = 100) {
  const since = new Date()
  since.setDate(since.getDate() - 30)

  return Post.aggregate([{
    $match: {
        $or: [
          {
            source: 'chicagofood'
          },
        ],
        $or: [
          {
            label: 'pizza'
          },
          {
            label: 'tacos'
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

function transform(posts) {
  return posts.reduce((accu, post) => {
    if (!accu[post.label]) {
      accu[post.label] = []
    }

    accu[post.label].push(post)

    return accu
  }, {})
}

async function exportHomePageData() {
  const posts = await getPosts()
  const data = transform(posts)

  const websiteStaticPath  = `../website/static/data/posts.json`
  fs.writeFileSync(websiteStaticPath, JSON.stringify(data));

  debug(`homepage posts exported: ${posts.length}`)
}

async function exportImagesPageData() {
  const files = await getFileList()

  const websiteStaticPath  = `../website/static/data/rawImages.json`
  fs.writeFileSync(websiteStaticPath, JSON.stringify(files));

  debug(`raw-images names exported: ${files.length}`)
}

async function main() {
  await openDB()

  await exportHomePageData()

  await exportImagesPageData()
}


main().then(() => {
  process.exit(0)
})
