/* eslint-disable no-nested-ternary */
import React, {
  useState,
  useContext,
  useEffect,
} from 'react'
import {
  Button,
  Col,
  Row,
  InputNumber,
  Statistic,
} from 'antd'
import axios from 'axios'
import ReactCountdownClock from 'react-countdown-clock'

import { SocketContext } from '../context/socket'

import Chat from '../components/Chat'
import Player from '../components/Player'
import Hand from '../components/Hand'
import calcHandValue from '../misc/calcHandValue'

const TIMEOUT = 10

const Game = ({ gameID }) => {
  const [name, setName] = useState('')
  const [ID, setID] = useState('')
  const socket = useContext(SocketContext)

  const [waiting, setWait] = useState(true)
  const [betting, setBetting] = useState(false)
  const [message, setMsg] = useState('')
  const [newGame, setNewGame] = useState(false)

  const [timerSeconds, setTimerSeconds] = useState(TIMEOUT)
  const [timerPaused, setTimerPaused] = useState(true)

  const [table, setTable] = useState([])

  const [started, setStarted] = useState(false)

  const [cards, setCards] = useState([])
  // const [value, setValue] = useState(0)

  const [bet, setBet] = useState(5)
  const [earnings, setEarnings] = useState(0)

  const [dealerCards, setDealerCards] = useState([])
  const [dealerValue, setDealerValue] = useState(true)
  const [dealer, setDealer] = useState(true)

  const [messages, setMessages] = useState([])

  const reset = () => {
    setDealer(true)
    setTable([])
    setWait(true)
    setCards(() => [])
    setDealerCards([])
  }

  const resetTimer = () => {
    setTimerSeconds(TIMEOUT + 1)
    setTimerPaused(true)
  }

  const timeoutCallback = () => {
    console.log('Timer finished')
    resetTimer()
    if (betting) {
      setBet(0)
      socket.emit('bet', { bet: 0, gameID })
      setBetting(false)
    } else {
      socket.emit('stand', { gameID })
      setWait(true)
    }
  }

  const sendStand = async () => {
    resetTimer()
    await socket.emit('stand', { gameID })
    setWait(true)
  }

  const sendHit = async () => {
    resetTimer()
    await socket.emit('hit', { gameID })
    setWait(true)
  }

  const placeBet = async () => {
    resetTimer()
    setBetting(false)
    setWait(true)
    console.log(`Bet placed of ${bet}`)
    await axios.post('/user/makeBet', { bet })
    await socket.emit('bet', { bet, gameID })
  }

  const sendChat = msg => {
    const newmsg = msg
    newmsg.user.avatar = `https://avatars.dicebear.com/api/avataaars/${ID}.svg`
    setMessages(msgs => [...msgs, msg])
    socket.emit('sendMessage', { gameID, message: newmsg.text })
  }

  useEffect(async () => {
    const res = await axios.get('/isAuth')
    const { data } = res
    const { firstName, authID } = data
    setID(authID)
    setName(firstName)
  }, [])

  useEffect(async () => {
    const { data } = await axios.get('/user/data')
    setEarnings(data.earnings)
    console.log(data)
  }, [betting, newGame])

  useEffect(() => {
    socket.on('status', ({ wait, msg, new_game }) => {
      console.log('status')
      console.log({ wait, msg, new_game })
      if (new_game) {
        setNewGame(new_game)
      }
      setWait(wait)
      setMsg(msg)
      if (!wait) {
        setTimerPaused(false)
        setTimerSeconds(() => TIMEOUT)
      }
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

    socket.on('status_bet', () => {
      setBetting(true)
    })

    socket.on('round-done', async ({ won, tied }) => {
      if (won) {
        await axios.post('/user/wonRound', { bet })
      } else if (tied) {
        await axios.post('/user/tiedRound', { bet })
      } else {
        await axios.post('/user/lostRound')
      }
      setDealer(false)
    })

    socket.on('newMessage', async obj => {
      const {
        gameID: newID,
        name: username,
        userID,
        message: text,
        date: createdAt,
      } = obj
      const msgID = messages.length + 1
      // eslint-disable-next-line eqeqeq
      if (newID == gameID) {
        const newMsg = {
          id: msgID,
          text,
          user: { id: userID, avatar: `https://avatars.dicebear.com/api/avataaars/${userID}.svg` },
        }
        setMessages(msgs => [...msgs, newMsg])
      }
    })
  }, [socket])

  useEffect(() => {
    console.log(messages)
  }, [messages])

  // useEffect(async () => {
  //   const newVal = calcHandValue(cards)
  //   setValue(newVal)
  //   if (newVal >= 21) {
  //     await socket.emit('stand')
  //     setWait(true)
  //   }
  // }, [cards])

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
            <Row>
              <Col span={8}>
                <h2>Dealer Cards</h2>
                <Hand cardList={dealerCards} dealer={dealer} />
                <h3>{`Value: ${dealerValue}`}</h3>
              </Col>
              <Col span={8}>
                <Player user="Your Hand" id={ID} cards={cards} />
                <br />
                <Button type="button" disabled={waiting || betting} onClick={sendHit}>
                  HIT
                </Button>
                <Button type="button" disabled={waiting || betting} onClick={sendStand}>
                  STAND
                </Button>
                <br />
                <br />
                <InputNumber
                  min={1}
                  max={1000}
                  onChange={amount => setBet(amount)}
                  value={bet}
                  step={5}
                  disabled={!betting}
                />
                <Button type="button" onClick={placeBet} disabled={!betting}>
                  Bet
                </Button>
              </Col>
              <Col span={4}>
                <Statistic title="Earnings" value={earnings} />
              </Col>
              <Col span={4}>
                <ReactCountdownClock
                  seconds={timerSeconds}
                  color="#000"
                  alpha={0.9}
                  size={100}
                  onComplete={timeoutCallback}
                  paused={timerPaused}
                />
              </Col>
            </Row>
            <br />
            <Row>
              <br />
              <br />
              <Col span={24 / (table.length - 1)}>
                {
                  table.map(({ user, cards: c, id }) => {
                    if (id !== ID && user !== 'DEALER') {
                      return (
                        <Player user={user} cards={c} id={id} />
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
              socket.emit('startGame', { firstName: name, id: ID, gameID })
              setStarted(true)
            }}
          >
            Start Game
          </Button>
        )}
      <Chat messages={messages} sendChat={sendChat} gameID={gameID} />
    </div>
  )
}

export default Game
