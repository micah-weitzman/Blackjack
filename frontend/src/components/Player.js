import React, { useState } from 'react'
import Hand from './Hand'

import calcHandValue from '../misc/calcHandValue'

const Player = ({ user, dealer, cards }) => (
  <div>
    <h1>{user}</h1>
    <Hand cardList={cards} />
    <h3>{`Value: ${calcHandValue(cards)}`}</h3>
  </div>
)

export default Player
