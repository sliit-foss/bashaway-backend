require('dotenv').config()
import express from 'express'
import compression from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import connectDB from './database'
import routes from './routes/index.routes'
import { isCelebrateError } from 'celebrate'
import { makeResponse } from './utils/response'
import logger from './utils/logger'
import { queryMapper } from './middleware/query'

const app = express()

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
})

app.use(limiter)

app.use(helmet())

app.use(compression())

app.use(cors({ origin: true, credentials: true }))

app.use(express.json({ limit: '1mb' }))

app.use(express.urlencoded({ extended: true }))

app.use(queryMapper)

app.get('/', (req, res) => res.status(200).json({ message: 'Bashaway Server Up and Running' }))

app.use('/api', routes)

app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message} | Stack: ${err.stack}`)
  if (isCelebrateError(err)) {
    for (const [key, value] of err.details.entries()) {
      return makeResponse({ res, status: 422, message: value.details[0].message })
    }
  } else if (err.expose) {
    return makeResponse({ res, status: err.status, message: err.message })
  } else if (err.name == 'MongoServerError' && err.code === 11000) {
    const key = Object.keys(err.keyValue)[0]
    return makeResponse({ res, status: 400, message: `The ${key} ${err.keyValue[key]} is already taken` })
  } else
    return makeResponse({
      res,
      status: 500,
      message: "Just patching things up. This'll be over in a jiffy!"
    })
})

connectDB()

global.__basedir = __dirname

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Bashaway server successfully started on port ${port}`)
})
