import React, { useEffect, useState } from 'react'
import axios from 'axios'

import {
  Statistic,
  Row,
  Col,
  Button,
} from 'antd'

const Home = () => {
  const [playerData, setPlayerData] = useState({})

  useEffect(async () => {
    const { data } = await axios.get('/user/data')
    setPlayerData(data)
  }, [])

  return (
    <Row gutter={16}>
      <Col span={8}>
        <Statistic title="Games Played" value={playerData.gamesPlayed} />
      </Col>
      <Col span={8}>
        <Statistic title="Games Won" value={playerData.gamesWon} />
      </Col>
      <Col span={8}>
        <Statistic
          title="Earnings"
          value={playerData.earnings}
          prefix="$"
        />
      </Col>
    </Row>
  )
}

export default Home
