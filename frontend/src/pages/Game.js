/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, useEffect, useContext } from 'react'
import {
  Input,
  Button,
  Checkbox,
  Row,
  Col,
} from 'antd'

import { SocketContext } from '../context/socket'
import Hand from '../components/Hand'
import calcHandValue from '../misc/calcHandValue'

const shuffle = arr => (
  arr.map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
)

const allCards = ['AC', 'AS', 'AD', 'AH', '2C', '2S', '2D', '2H', '3C', '3S', '3D', '3H', '4C', '4S', '4D', '4H', '5C', '5S', '5D', '5H', '6C', '6S', '6D', '6H', '7C', '7S', '7D', '7H', '8C', '8S', '8D', '8H', '9C', '9S', '9D', '9H', '10C', '10S', '10D', '10H', 'JC', 'JS', 'JD', 'JH', 'QC', 'QS', 'QD', 'QH', 'KC', 'KS', 'KD', 'KH']

const Game = () => {
  const [name, setName] = useState('')

  const socket = useContext(SocketContext)
  const [cards, setCards] = useState(shuffle(allCards))

  const [playerHand, setPlayerHand] = useState([])
  const [dealerHand, setDealerHand] = useState([])

  const [dealer, setDealer] = useState(true)
  const [visible, setVisible] = useState(true)

  const [dealerValue, setDealerValue] = useState(0)
  const [playerValue, setPlayerValue] = useState(0)

  const [userDone, setUserDone] = useState(false)
  const [endGame, setEndGame] = useState(false)
  const [endGameText, setEndGameText] = useState('')

  const [numPlayers, setNumPlayers] = useState(0)
  const [otherPlayers, setOtherPlayers] = useState([])

  const popCard = num => {
    const arr = cards.slice(0, num)
    setCards(c => c.filter((elem, index) => index > num))
    return arr
  }

  const hitPlayer = () => {
    const newCard = popCard(1)
    setPlayerHand(hand => [...hand, newCard])
  }

  const hitDealer = () => {
    const newCard = popCard(1)
    setDealerHand(hand => [...hand, newCard])
  }

  useEffect(() => {
    setPlayerValue(() => calcHandValue(playerHand))
    socket.emit('updated hand', name, playerHand)
  }, [playerHand])

  useEffect(() => {
    if (playerValue >= 21) {
      setUserDone(true)
    }
  }, [playerValue])

  useEffect(() => {
    setDealerValue(() => calcHandValue(dealerHand))
  }, [dealerHand])

  useEffect(() => {
    socket.on('number players', count => setNumPlayers(count))
    socket.on('other players', data => setOtherPlayers(data))
    socket.on('new hands', data => {
      console.log(data)
      setOtherPlayers(data)
    })
  }, [socket])

  // prompt user for name
  useEffect(() => {
    const tmp = window.prompt('name')
    setName(tmp)
    socket.emit('login', tmp)
  }, [])

  // run when user is done to find dealer hand

  const allHands = Object.keys(otherPlayers).map(k => (
    <Col span={24 / numPlayers}>
      <h1>{k}</h1>
      <h3>
        {`Value: ${calcHandValue(otherPlayers[k])}`}
      </h3>
      <Hand cardList={otherPlayers[k]} visible={visible} />
    </Col>
  ))

  return (
    <div style={{ padding: 30 }}>
      {endGame ? <h1>{ endGameText } </h1> : null }
      <h1>Dealer</h1>
      <h3>
        {`Value: ${dealerValue}`}
      </h3>
      <Hand cardList={dealerHand} dealer={!userDone} visible={visible} />
      <Row>
        <Col span={24 / numPlayers}>
          <h1>Yourhand</h1>
          <h3>
            {`Value: ${playerValue}`}
          </h3>
          <Hand cardList={playerHand} visible={visible} />
          <br />
          <br />
          {userDone ? null
            : (
              <>
                <Button
                  onClick={() => {
                    hitPlayer()
                  }}
                >
                  Hit
                </Button>
                <Button onClick={() => setUserDone(true)}>
                  Stand
                </Button>
              </>
            )}
        </Col>
        {otherPlayerHands}
      </Row>
      { endGame
        ? <Button type="danger" onClick={() => reset()}>Reset?</Button>
        : null}
    </div>
  )
}

export default Game
