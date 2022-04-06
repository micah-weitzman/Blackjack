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

import { SocketContext } from '../context/socket'

import Player from '../components/Player'
import Hand from '../components/Hand'
import calcHandValue from '../misc/calcHandValue'

const Home = () => {
  const [name, setName] = useState('')
  const socket = useContext(SocketContext)

  const [waiting, setWait] = useState(true)
  const [message, setMsg] = useState('')
  const [newGame, setNewGame] = useState(false)

  const [table, setTable] = useState([])

  const [started, setStarted] = useState(false)

  const [cards, setCards] = useState([])
  const [value, setValue] = useState(0)

  const [dealerCards, setDealerCards] = useState([])
  const [dealer, setDealer] = useState(true)
  const [dealerValue, setDealerValue] = useState(true)

  const reset = () => {
    setDealer(true)
    setTable([])
    setWait([])
    setCards(() => [])
  }

  useEffect(() => {
    const n = window.prompt('Enter name')
    setName(n)
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

    socket.on('user_cards', ({ user, dealer: d, cards: c }) => {
      console.log('user_cards')
      console.log(user, d, c)
    })

    socket.on('table_cards', ({ table: t }) => {
      console.log('table_cards')
      console.log(t)

      setTable(t)
      setDealerCards(t[0].cards)
    })

    socket.on('score', ({ user, score }) => {
      console.log('score')
      console.log(user, score)
    })

    socket.on('card', ({ card }) => {
      console.log('card')
      console.log(card)
      setCards(c => [...c, card])
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
    setValue(calcHandValue(cards))
  }, [cards])

  useEffect(() => {
    if (dealer) {
      setDealerValue(calcHandValue(dealerCards.slice(1)))
    } else {
      setDealerValue(calcHandValue(dealerCards))
    }
  }, [dealerCards, dealer])

  return (
    <div style={{ paddingLeft: 50 }}>
      <p>{waiting}</p>
      <br />
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
            <h2>Your Hand</h2>
            <br />
            <Row>
              <Col span={24 / (table.length - 1)}>
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
              </Col>

              <br />
              <br />
              <Col span={24 / (table.length - 1)}>
                {
                  table.map(({ user, cards: c }) => {
                    if (user !== name && user !== 'DEALER') {
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
              socket.emit('startGame', name)
              setStarted(true)
            }}
          >
            Start Game
          </Button>
        )}
    </div>
  )
}

export default Home
