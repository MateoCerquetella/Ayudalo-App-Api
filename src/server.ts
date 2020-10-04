import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import routing from './routing'
import redis from 'redis'
import session from 'express-session'
import connectRedis from 'connect-redis'
import { __cookie_secret__, __prod__ } from './api/core.constants'

const main = async () => {
  // Declare server
  const app = express()

  let RedisStore = connectRedis(session)
  let redisClient = redis.createClient()

  app.use(
    session({
      name: 'qid',
      store: new RedisStore({
        client: redisClient
      }),
      cookie: {
        maxAge: 86400000, // 1 day
        httpOnly: true,
        sameSite: 'lax',
        secure: __prod__
      },
      saveUninitialized: false,
      secret: process.env.COOKIE_SECRET || __cookie_secret__,
      resave: false,
    })
  )

  // CORS configuration
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cors())

  // Routing
  routing(app)

  // Set the port
  app.set('port', process.env.PORT || 3000)

  // Start the server
  app.listen(app.get('port'), () => {
    console.log('server on port:', app.get('port'))
  })
}


main()