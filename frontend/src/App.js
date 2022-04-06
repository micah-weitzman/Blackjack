import React from 'react'
import { SocketContext, socket } from './context/socket'
import Game from './pages/Game'
import Home from './pages/Home'

const App = () => (
  <SocketContext.Provider value={socket}>
    <Home />
  </SocketContext.Provider>
)

export default App
