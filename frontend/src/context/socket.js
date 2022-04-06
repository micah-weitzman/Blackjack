import React from 'react'
import socketClient from 'socket.io-client'

const SOCKET_URL = 'http://127.0.0.1:3001'

export const socket = socketClient(SOCKET_URL)
export const SocketContext = React.createContext()
