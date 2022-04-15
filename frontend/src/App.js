/* eslint-disable no-nested-ternary */
import React, { useState, useTransition, useEffect } from 'react'

import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'
import axios from 'axios'
import { Layout } from 'antd'

import { SocketContext, socket } from './context/socket'

import Login from './pages/Login'
import Home from './pages/Home'
import Game from './pages/Game'

import Navbar from './components/Navbar'

const { Content } = Layout

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
    <Layout>
      {busy
        ? null
        : isAuth ? (
          <>
            <Navbar name={name} />
            <Content style={{ padding: '24px', background: '#fff' }}>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/home" element={<Home />} />
                  <Route
                    path="/gameOne"
                    element={(
                      <SocketContext.Provider value={socket}>
                        <Game gameID={0} />
                      </SocketContext.Provider>
                      )}
                  />
                  <Route
                    path="/gameTwo"
                    element={(
                      <SocketContext.Provider value={socket}>
                        <Game gameID={1} />
                      </SocketContext.Provider>
                      )}
                  />
                  <Route
                    path="/gameThree"
                    element={(
                      <SocketContext.Provider value={socket}>
                        <Game gameID={2} />
                      </SocketContext.Provider>
                      )}
                  />
                  <Route path="/login" element={<Login />} />
                </Routes>
              </BrowserRouter>
            </Content>
          </>
        ) : (
          <BrowserRouter>
            <Routes>
              <Route path="*" element={<Login />} />
            </Routes>
          </BrowserRouter>
        )}
    </Layout>
  )
}

export default App
