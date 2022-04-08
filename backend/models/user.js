const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  authID: { type: Number, required: true },
})

const User = model('User', userSchema)

module.exports = User
