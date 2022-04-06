/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react'

import Card from './Card'

const Hand = ({
  cardList,
  dealer,
  visible,
  show,
}) => {
  // if not visible, display all cards as backs
  if (!visible && visible !== undefined) {
    return (
      <div className="hand hhand-compact">
        { cardList.map((cardName, index) => (
          <Card name="BLUE_BACK" key={index} />
        ))}
      </div>
    )
  }
  // for dealer, show first card back and second card top
  if (dealer && !show) {
    return (
      <div className="hand hhand-compact">
        { cardList.map((cardName, index) => {
          if (index === 0) {
            return (<Card name="BLUE_BACK" key={index} />)
          }
          return (<Card name={cardName} key={index} />)
        })}
      </div>
    )
  }

  return (
    <div className="hand hhand-compact">
      { cardList.map((cardName, index) => (
        <Card name={cardName} key={index} />
      ))}
    </div>
  )
}

export default Hand
