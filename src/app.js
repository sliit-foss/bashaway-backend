require('dotenv').config()
import express from 'express'
import compression from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import connectDB from './database'
import routes from './routes/index.routes'
import { isCelebrateError } from 'celebrate'
import { makeResponse } from './utils/response'
import logger from './utils/logger'

const app = express()

app.use(helmet())

app.use(compression())

app.use(cors({ origin: true, credentials: true }))

app.use(express.json({ limit: '1mb' }))

app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => res.status(200).json({ message: 'Bashaway Server Up and Running' }))

app.use('/api', routes)

app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message} | Stack: ${err.stack}`)
  if (isCelebrateError(err)) {
    for (const [key, value] of err.details.entries()) {
      return makeResponse({ res, status: 422, message: value.details[0].message })
    }
  } else if (err.type && err.type == 'entity.parse.failed') {
    return makeResponse({
      res,
      status: 400,
      message: "Error: Cannot parse request body",
    })
  } else
    return makeResponse({
      res,
      status: 500,
      message: "Just patching things up. This'll be over in a jiffy!",
    })
})

connectDB()

global.__basedir = __dirname

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Bashaway server successfully started on port ${port}`)
})
