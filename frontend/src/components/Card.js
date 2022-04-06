import React from 'react'

const Card = ({ name }) => {
  const src = `/assets/cards/${name}.svg`

  return (
    <img className="card" src={src} alt={name} />
  )
}

export default Card
