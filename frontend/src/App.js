/* eslint-disable no-nested-ternary */
import React, { useState, useTransition, useEffect } from 'react'

import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'
import axios from 'axios'
import { Spinner } from 'react-bootstrap'

import { SocketContext, socket } from './context/socket'

import Login from './pages/Login'
import Home from './pages/Home'
import Game from './pages/Game'

import Navbar from './components/Navbar'

const App = () => {
  const [busy, setBusy] = useState(true)
  const [name, setName] = useState('')

  const fetch = async () => {
    try {
      const res = await axios.get('/isAuth')
      const { data } = res
      const { firstName } = data
      setName(firstName)
      return true
    } catch {
      return false
    }
  }
  const [isAuth, setIsAuth] = useState(false)

  useEffect(async () => {
    const ans = await fetch()
    setIsAuth(() => ans)
    setBusy(false)
  }, [])

  return (
    <>
      {busy
        ? null
        : isAuth ? (
          <>
            <Navbar name={name} />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route
                  path="/game"
                  element={(
                    <SocketContext.Provider value={socket}>
                      <Game />
                    </SocketContext.Provider>
                    )}
                />
                <Route path="/login" element={<Login />} />
              </Routes>
            </BrowserRouter>
          </>
        ) : (
          <BrowserRouter>
            <Routes>
              <Route path="*" element={<Login />} />
            </Routes>
          </BrowserRouter>
        )}
    </>
  )
}

export default App
