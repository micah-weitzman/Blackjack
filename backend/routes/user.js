/* eslint-disable prefer-destructuring */
const express = require('express')

const isAuth = require('../middleware/isAuthenticated')
const User = require('../models/user')

const router = express.Router()

router.get('/data', isAuth, async (req, res, next) => {
  const { authID } = req.session.passport.user
  const data = await User.findOne({ authID })
  const ret = {
    gamesPlayed: data.gamesPlayed,
    gamesWon: data.gamesWon,
    earnings: data.earnings,
  }
  res.json(ret)
})

router.post('/makeBet', isAuth, async (req, res, next) => {
  const { authID } = req.session.passport.user
  const { bet } = req.body
  console.log(`User made a bet of $${bet}`)
  await User.findOneAndUpdate(
    { authID },
    { $inc: { earnings: -bet } },
  ).exec()
  res.send('Bet recieved')
})

router.post('/lostRound', isAuth, async (req, res, next) => {
  const { authID } = req.session.passport.user
  try {
    await User.findOneAndUpdate(
      { authID },
      { $inc: { gamesPlayed: 1 } },
    ).exec()
    res.send('Updated')
  } catch (e) {
    next(e)
  }
})

router.post('/wonRound', isAuth, async (req, res, next) => {
  const { bet } = req.body
  const { authID } = req.session.passport.user
  try {
    await User.findOneAndUpdate(
      { authID },
      {
        $inc: { gamesPlayed: 1, gamesWon: 1, earnings: (2 * bet) },
      },
    ).exec()
    res.send('Updated')
  } catch (e) {
    next(e)
  }
})

router.post('/tiedRound', isAuth, async (req, res, next) => {
  const { bet } = req.body
  const { authID } = req.session.passport.user
  try {
    await User.findOneAndUpdate(
      { authID },
      {
        $inc: { gamesPlayed: 1, gamesWon: 1, earnings: bet },
      },
    ).exec()
    res.send('Updated')
  } catch (e) {
    next(e)
  }
})

module.exports = router
