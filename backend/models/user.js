const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  authID: { type: Number, required: true },

  gamesPlayed: { type: Number, default: 0 },
  gamesWon: { type: Number, default: 0 },
  earnings: { type: Number, default: 10000 },
})

const User = model('User', userSchema)

module.exports = User
