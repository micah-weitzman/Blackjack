import React, { useEffect, useState } from 'react'
import axios from 'axios'

import {
  Statistic,
  Row,
  Col,
  Button,
} from 'antd'
import { Link } from 'react-router-dom'

const Home = () => {
  const [playerData, setPlayerData] = useState({})

  useEffect(async () => {
    const { data } = await axios.get('/user/data')
    setPlayerData(data)
  }, [])

  return (
    <>
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
      <Row style={{ marginTop: 15 }}>
        <Link to="/gameOne">
          <Button style={{ marginRight: 20 }}>
            Game One
          </Button>
        </Link>
        <Link to="/gameTwo">
          <Button style={{ marginRight: 20 }}>
            Game Two
          </Button>
        </Link>
        <Link to="/gameThree">
          <Button style={{ marginRight: 20 }}>
            Game Three
          </Button>
        </Link>
      </Row>
    </>
  )
}

export default Home
