import React from 'react'
import 'cardsJS/dist/cards.css'

const Card = ({ name }) => {
  const src = `/assets/cards/${name}.svg`

  return (
    <img className="playing_card" src={src} alt={name} />
  )
}

export default Card
