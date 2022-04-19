const { Schema, model } = require('mongoose')

const chatroomSchema = new Schema({
  name: { type: String, required: true },
  date: { type: Date },
  message: { type: String, required: true },
})

const Chatroom1 = model('Chatroom1', chatroomSchema)
const Chatroom2 = model('Chatroom2', chatroomSchema)
const Chatroom3 = model('Chatroom3', chatroomSchema)

module.exports = { Chatroom1, Chatroom2, Chatroom3 }
