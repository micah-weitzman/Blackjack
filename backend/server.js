/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
const express = require('express')

const passport = require('passport')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const path = require('path')
const dotenv = require('dotenv').config()

const http = require('http').createServer()
const io = require('socket.io')(http, { cors: { origin: '*' } })

const Game = require('./code/game')
const User = require('./code/user')

const authRouter = require('./routes/auth')
const userRoutes = require('./routes/user')

const { Chatroom1, Chatroom2, Chatroom3 } = require('./models/chatrooms')

const chatrooms = [Chatroom1, Chatroom2, Chatroom3]

const app = express()
const game0 = new Game()
const game1 = new Game()
const game2 = new Game()
game0.io = io
game1.io = io
game2.io = io

const games = [game0, game1, game2]

const port = 3000
const socketPort = 3001

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static('dist'))
app.use(session({
  secret: 'super-secret-key',
  resave: false,
  saveUninitialized: false,
}))

app.use(passport.authenticate('session'))

app.use('/', authRouter)
app.use('/user', userRoutes)

// app.use((err, req, res, next) => {
//   if (err) {
//     res.status(500)
//     return next(err)
//   }
//   return next()
// })

io.on('connection', async socket => {
  const user = new User(new Date().toISOString(), socket)
  socket.on('startGame', async ({ firstName, id, gameID }) => {
    user.name = firstName
    user.id = id
    games[gameID].users.push(user)
    if (!games[gameID].running) {
      games[gameID].freshstart = false
      // games[gameID].update_user_view(user)
      games[gameID].start_game()
    }

    if (games[gameID].users.length > games[gameID].max_active_users) {
      await socket.emit('status', {
        wait: true,
        msg: 'Max players playing',
      })
    } else if (games[gameID].running) {
      await socket.emit('status', {
        wait: true,
        msg: 'Waiting for next round',
      })
    }
  })

  socket.on('disconnect', () => {
    console.log('User disconnected')
    games.forEach(g => g.remove_user(socket))
  })

  socket.on('bet', async ({ bet, gameID }) => {
    console.log(`User bet: ${bet}`)
    await socket.emit('status', {
      wait: true,
      msg: 'Waiting for other players to place bets',
    })
    games[gameID].notify_next_bet()
  })

  socket.on('hit', async ({ gameID }) => {
    console.log('user hit')
    await user.socket.emit('status', {
      wait: false,
      msg: 'Your turn',
    })
    games[gameID].deal_card(user)
    games[gameID].update_user_view()
  })

  socket.on('stand', async ({ gameID }) => {
    console.log('user stand')
    await socket.emit('status', {
      wait: true,
      msg: 'Waiting for other players',
    })
    await games[gameID].notify_next_player()
  })

  socket.on('sendMessage', async ({ message, gameID }) => {
    // eslint-disable-next-line prefer-destructuring
    const Room = chatrooms[gameID]
    const time = Date.now()
    await Room.create({ name: user.name, date: time, message })
    io.emit('newMessage', {
      gameID,
      name: user.name,
      message,
      date: time,
    })
  })
})

app.use((err, req, res, next) => {
  if (err) {
    res.status(500)
    return next(err)
  }
  return next()
})

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/assets/favicon.png'))
})

app.get('/assets/cards/:name', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/assets/cards', req.params.name))
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

http.listen(socketPort, () => {
  console.log(`Socket listening on port ${socketPort}`)
})

app.listen(port, () => {
  console.log(`App running on port ${port}`)
})

// const closeGame = () => {
//   console.log('closing server')
//   io.httpServer.close()
//   http.close()
// }
// process.on('SIGINT', closeGame).on('SIGTERM', closeGame)
