/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
const User = require('./user')
const Deck = require('./deck')

class Game {
  constructor() {
    this.io = undefined
    this.users = []
    this.active_users = []
    this.deck = []
    this.freshstart = true// fresh start (no previous running table)
    this.running = false
    this.next_player = 0// the next player to act (hit/stick). 0 is the dealer (1st player in list)
    this.max_active_users = 4
    const user = new User('DEALER')
    user.dealer = true
    user.active = true
    this.users.push(user)
  }

  start_game() {
    console.log('Game started')
    const _this = this
    this.running = true
    this.deck = new Deck()
    this.deck.shuffle()
    this.next_player = 0// index in user list (index 0 is the dealer)
    this.active_users = []
    // this.active_users.push(this.users[0])
    this.update_user_status()
    this.active_users.forEach(user => {
      user.cards = []
      if (!user.dealer) {
        user.socket.emit('reset')
        // deal two cards per user
        user.socket.emit('status', {
          wait: true,
          new_game: true,
          msg: 'New Game started! Wait for your turn!',
        })
      }
      _this.deal_card(user)
      _this.deal_card(user)
    })
    this.update_user_view()
    this.notify_next_player()
  }

  close_game() {
    console.log('closing game')
    this.users.forEach(user => {
      user.cards = []
    })
    this.active_users = []
    this.running = false
  }

  update_user_status() {
    const max_index = (this.users.length <= this.max_active_users ? this.users.length : this.max_active_users)
    this.users.forEach(user => {
      user.active = true
      this.active_users.push(user)
    })
  }

  update_user_view(user_) {
    const cards = []
    this.active_users.forEach(_user => {
      cards.push({
        user: _user.id,
        dealer: _user.dealer,
        cards: this.prepare_cards_for_display(_user),
      })
    })
    if (user_) {
      user_.socket.emit('table_cards', { table: cards })
    } else {
      this.io.emit('table_cards', { table: cards })
    }
  }

  notify_next_player() {
    console.log('notify_next_player')
    this.next_player += 1
    if (this.next_player === this.active_users.length) {
      this.dealer_act()
      this.finalize_game()
      this.close_game()
      const _self = this
      setTimeout(() => {
        _self.start_game()
      }, 7000)
    } else {
      // eslint-disable-next-line prefer-destructuring
      const _user = this.active_users[this.next_player]
      if (_user.socket) {
        _user.socket.emit('status', { wait: false, msg: 'Your turn! HIT or STAY!' })
      }
    }
  }

  dealer_act() {
    console.log('Time for dealer to act')
    let total = 0
    // eslint-disable-next-line prefer-destructuring
    const [dealer, ...rest] = this.active_users
    while (total < 17) {
      this.deal_card(dealer)
      total = this.highest_sum_from_cards(dealer)
      this.update_user_view()
    }
    dealer.total = total
    this.io.emit('score', { user: dealer.id, score: dealer.total })
  }

  finalize_game() {
    console.log('Time to determine losers/winners')
    // eslint-disable-next-line prefer-destructuring
    for (let i = 1, len = this.active_users.length; i < len; i++) {
      // eslint-disable-next-line prefer-destructuring
      const user = this.active_users[i]
      user.total = this.highest_sum_from_cards(user)
      this.io.emit('score', { user: user.id, score: user.total })
      if (user.total > 21) {
        user.socket.emit('status', { wait: true, msg: 'You LOST! Wait for next round..' })
      } else if (this.active_users[0].total > 21) {
        user.socket.emit('status', { wait: true, msg: 'You WON! Wait for next round..' })
      } else if (user.total === this.active_users[0].total) {
        user.socket.emit('status', { wait: true, msg: 'TIE! Wait for next round..' })
      } else if (user.total > this.active_users[0].total) {
        user.socket.emit('status', { wait: true, msg: 'You WON! Wait for next round..' })
      } else {
        user.socket.emit('status', { wait: true, msg: 'You LOST! Wait for next round..' })
      }
      user.socket.emit('round-done')
    }
  }

  highest_sum_from_cards(user) {
    let total = 0
    const values = []
    values[0] = []
    values[1] = []
    console.log(user.cards)
    user.cards.forEach(card => {
      const firstChar = parseInt(card.charAt(0), 10)
      if (card.charAt(0) === 'A') {
        values[0].push(1)
        values[1].push(11)
      } else if (Number.isInteger(firstChar) && firstChar >= 2) {
        values[0].push(firstChar)
        values[1].push(firstChar)
      } else {
        values[0].push(10)
        values[1].push(10)
      }
    })
    const sum_low = values[0].reduce((a, b) => (a + b))
    const sum_high = values[1].reduce((a, b) => (a + b))
    total = ((sum_high <= 21) ? sum_high : sum_low)
    return total
  }

  deal_card(user) {
    const card = this.deck.popCard()
    user.cards.push(card)
    if (!user.dealer) {
      user.socket.emit('card', { card })
    }
    this.io.emit('user_cards', {
      user: user.id,
      dealer: user.dealer,
      cards: this.prepare_cards_for_display(user),
    })
  }

  prepare_cards_for_display(user) {
    const cards = []
    if (!user.dealer) {
      user.cards.forEach((elem, i) => {
        // if (i <= 1) {
        //   cards.push({ card: {}, hidden: true })
        // } else {
        // cards.push({ card: elem, hidden: false })
        cards.push(elem)
        // }
      })
    } else {
      user.cards.forEach((elem, i) => {
        // if (i === 0) {
        //   cards.push({ card: {}, hidden: true })
        // } else {
        // cards.push({ card: elem, hidden: false })
        cards.push(elem)
        // }
      })
    }
    return cards
  }

  lookup_user_by_socket(socket, list) {
    let ret = -1
    list.forEach((elem, index) => {
      if (elem.socket === socket) {
        ret = index
      }
    })
    return ret
  }

  remove_user(socket) {
    const idx = this.lookup_user_by_socket(socket, this.users)
    const idx2 = this.lookup_user_by_socket(socket, this.active_users)
    if (idx > -1) {
      this.users.splice(idx, 1)
      if (this.users.length === 1) {
        // everyone left..
        this.freshstart = true
        this.close_game()
      }
    }
    if (idx2 > -1) {
      this.active_users.splice(idx2, 1)
      this.update_user_status()
      if (this.active_users.length > 1) {
        this.start_game()
      }
    }
  }
}

module.exports = Game
