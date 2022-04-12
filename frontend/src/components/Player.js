import React, { useState } from 'react'
import { Card } from 'antd'

import Hand from './Hand'
import calcHandValue from '../misc/calcHandValue'

const NULL_HAND = ['BLUE_BACK', 'BLUE_BACK']

const Player = ({ user, dealer, cards }) => (
  <Card style={{ width: 200 }}>
    <h3>{user}</h3>
    <Hand cardList={cards} dealer={dealer} />
    <h3>{`Value: ${calcHandValue(cards)}`}</h3>
  </Card>
)

export default Player
