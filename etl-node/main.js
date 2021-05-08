const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')


const debug = require('debug')('app')

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morgan('combined'))


const config = require('./config')
const { openDB } = require('./support/database')
const { getFileList, moveFile } = require('./support/folder')
const { updateLabel } = require('./module/post/label')
 
app.get('/', function (req, res) {
  res.send(':)')
})

app.get('/images', async function (req, res) {
  const files = await getFileList()

  res.send(files)
})

app.post('/image/:image', async function (req, res) {
  const { category } = req.body
  const { image } = req.params
  
  await moveFile(category, image)

  await updateLabel(category, image)

  res.send({ status: 'done'})
})


async function main() {
  await openDB()
  debug('DB open')

  await app.listen(config.get('port'), config.get('ip'), () => {
    debug(`server running: ${config.get('port')}`)
  })
}

main()
