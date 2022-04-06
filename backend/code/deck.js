const cards = ['AC', 'AS', 'AD', 'AH', '2C', '2S', '2D', '2H', '3C', '3S', '3D', '3H', '4C', '4S', '4D', '4H', '5C', '5S', '5D', '5H', '6C', '6S', '6D', '6H', '7C', '7S', '7D', '7H', '8C', '8S', '8D', '8H', '9C', '9S', '9D', '9H', '10C', '10S', '10D', '10H', 'JC', 'JS', 'JD', 'JH', 'QC', 'QS', 'QD', 'QH', 'KC', 'KS', 'KD', 'KH']

const DeckProto = {
  shuffle() {
    this.cards = this.cards.map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
  },

  createDeck() {
    this.cards = cards
  },

  popCard() {
    const { cards: c } = this
    const [first, ...rest] = c
    this.cards = rest
    return first
  },
}

function Deck() {
  this.cards = cards
}
Deck.prototype = DeckProto
Deck.prototype.constructor = Deck

module.exports = Deck
