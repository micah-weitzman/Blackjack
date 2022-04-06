class User {
  constructor(id, socket) {
    this.socket = socket
    this.id = id
    this.cards = []
    this.active = false
    this.dealer = false
  }
}

module.exports = User
