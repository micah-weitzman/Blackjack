import React, {
  useState,
  useContext,
  useEffect,
} from 'react'
import {
  Button,
  Col,
  Row,
} from 'antd'
import axios from 'axios'

import { SocketContext } from '../context/socket'

import Player from '../components/Player'
import Hand from '../components/Hand'
import calcHandValue from '../misc/calcHandValue'

const Game = () => {
  const [name, setName] = useState('')
  const [ID, setID] = useState('')
  const socket = useContext(SocketContext)

  const [waiting, setWait] = useState(true)
  const [message, setMsg] = useState('')
  const [newGame, setNewGame] = useState(false)

  const [table, setTable] = useState([])

  const [started, setStarted] = useState(false)

  const [cards, setCards] = useState([])
  const [value, setValue] = useState(0)

  const [dealerCards, setDealerCards] = useState([])
  const [dealerValue, setDealerValue] = useState(true)
  const [dealer, setDealer] = useState(true)

  const reset = () => {
    setDealer(true)
    setTable([])
    setWait([])
    setCards(() => [])
  }

  useEffect(async () => {
    const res = await axios.get('/isAuth')
    const { data } = res
    const { firstName, authID } = data
    setID(authID)
    setName(firstName)
  }, [])

  useEffect(() => {
    socket.on('status', ({ wait, msg, new_game }) => {
      console.log('status')
      console.log({ wait, msg, new_game })
      if (new_game) {
        setNewGame(new_game)
      }
      setWait(wait)
      setMsg(msg)
    })

    socket.on('table_cards', ({ table: t }) => {
      console.log('table_cards')
      console.log(t)
      setTable(t)
    })

    socket.on('reset', () => {
      console.log('reset')
      reset()
    })

    socket.on('round-done', () => {
      setDealer(false)
    })
  }, [socket])

  useEffect(() => {
    const newVal = calcHandValue(cards)
    setValue(newVal)
    if (newVal >= 21) {
      socket.emit('stand')
    }
  }, [cards])

  useEffect(() => {
    if (dealer) {
      setDealerValue(calcHandValue(dealerCards.slice(1)))
    } else {
      setDealerValue(calcHandValue(dealerCards))
    }
  }, [dealerCards, dealer])

  useEffect(() => {
    table.forEach(({
      id: playerID,
      dealer: isDealer,
      cards: playerCards,
    }) => {
      if (isDealer) {
        setDealerCards(playerCards)
      } else if (ID === playerID) {
        setCards(playerCards)
      }
    })
  }, [table])

  return (
    <div style={{ paddingLeft: 50 }}>
      <br />
      <p>{message}</p>
      <br />
      <br />
      {started
        ? (
          <>
            <h2>Dealer Cards</h2>
            <Hand cardList={dealerCards} dealer={dealer} />
            <h3>{`Value: ${dealerValue}`}</h3>
            <br />
            <br />
            <br />
            <Row>
              <Col span={24 / (table.length - 1)}>
                {value !== 0
                  ? (
                    <>
                      <h2>Your Hand</h2>
                      <Hand cardList={cards} />
                      <h3>{`Value: ${value}`}</h3>
                      <br />
                      { waiting ? null : (
                        <>
                          <Button type="button" onClick={() => socket.emit('hit')}>
                            HIT
                          </Button>
                          <Button type="button" onClick={() => socket.emit('stand')}>
                            STAND
                          </Button>
                        </>
                      )}
                    </>
                  )
                  : <h2>Waiting for next round</h2> }
              </Col>
              <br />
              <br />
              <Col span={24 / (table.length - 1)}>
                {
                  table.map(({ user, cards: c, id }) => {
                    if (id !== ID && user !== 'DEALER') {
                      return (
                        <Player user={user} cards={c} />
                      )
                    }
                    return null
                  })
                }
              </Col>
            </Row>
          </>
        )
        : (
          <Button
            type="button"
            onClick={() => {
              socket.emit('startGame', { firstName: name, id: ID })
              setStarted(true)
            }}
          >
            Start Game
          </Button>
        )}
    </div>
  )
}

export default Game
