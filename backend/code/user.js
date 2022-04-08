class User {
  constructor(name, socket) {
    this.socket = socket
    this.id = ''
    this.name = name
    this.cards = []
    this.active = false
    this.dealer = false
  }
}

module.exports = User
