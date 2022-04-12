const express = require('express')

const router = express.Router()

router.use((req, res, next) => {
  if (req.session.passport !== null && req.session.passport !== undefined) {
    next()
  } else {
    next(Error('User is not authenticated'))
  }
})

module.exports = router
