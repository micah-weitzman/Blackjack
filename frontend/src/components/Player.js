import React, { useState } from 'react'
import { Card } from 'antd'

import Hand from './Hand'
import calcHandValue from '../misc/calcHandValue'

const NULL_HAND = ['BLUE_BACK', 'BLUE_BACK']

const Player = ({
  user,
  dealer,
  cards,
  id,
}) => (
  <Card style={{ width: 200 }}>
    <span>
      <div
        style={{
          height: 30,
          width: 30,
          marginBottom: 2,
        }}
      >
        <img
          style={{
            height: 30,
            width: 30,
            borderRadius: '50%',
            objectFit: 'cover',
          }}
          src={`https://avatars.dicebear.com/api/avataaars/${id}.svg`}
          alt="avatar"
        />
      </div>
      <h3>{user}</h3>
    </span>
    <Hand cardList={cards} dealer={dealer} />
    <h3>{`Value: ${calcHandValue(cards)}`}</h3>
  </Card>
)

export default Player
