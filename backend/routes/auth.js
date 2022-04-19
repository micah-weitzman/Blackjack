/* eslint-disable no-console */
const express = require('express')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oidc')

const User = require('../models/user')
const isAuth = require('../middleware/isAuthenticated')

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/oauth2/redirect/google',
  scope: ['profile'],
}, async (issuer, profile, cb) => {
  const { name, id, displayName } = profile
  const { familyName, givenName } = name
  // console.log(`familyName: ${familyName}`)
  // console.log(`givenName: ${givenName}`)
  const usrObj = {
    firstName: givenName,
    lastName: familyName,
    authID: id,
  }

  try {
    const res = await User.findOne(usrObj)
    if (res.length === 0) {
      console.log(`User "${givenName}, ${familyName}" created successfully`)
    }
    console.log(`User "${givenName}, ${familyName}" logged in`)
    cb(null, usrObj)
  } catch (e) {
    try {
      await User.create(usrObj)
      cb(null, usrObj)
    } catch (new_e) {
      cb(new_e)
    }
  }
}))

passport.serializeUser((user, cb) => {
  process.nextTick(() => {
    // cb(null, {
    //   authID: user.authID,
    //   familyName: user.familyName,
    //   firstName: user.firstName,
    // })
    cb(null, user)
  })
})

passport.deserializeUser((user, cb) => {
  process.nextTick(() => cb(null, user))
})

const router = express.Router()

router.get('/login/federated/google', passport.authenticate('google'))

router.get('/oauth2/redirect/google', passport.authenticate('google', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/login',
}))

router.get('/isAuth', isAuth, (req, res, next) => {
  res.json(req.session.passport.user)
})

/* POST /logout
 *
 * This route logs the user out.
 */
router.get('/logout', isAuth, (req, res, next) => {
  req.logout()
  req.session.destroy()
  res.clearCookie('connect.sid')
  res.redirect('/')
})

module.exports = router
