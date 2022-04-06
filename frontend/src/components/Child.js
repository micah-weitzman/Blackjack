import React, {
  useState,
  useContext,
  useCallback,
  useEffect,
} from 'react'
import { SocketContext } from '../context/socket'

const Child = ({ userId }) => {
  const socket = useContext(SocketContext)

  const [joined, setJoined] = useState(false)

  const handleInviteAccepted = useCallback(() => {
    setJoined(true)
  }, [])

  const handleJoinChat = useCallback(() => {
    socket.emit('TEST_OTHER', userId)
  }, [])

  socket.emit('RECV', userId)
  socket.on('TEST', handleInviteAccepted)

  useEffect(() => {
  }, [socket, userId, handleInviteAccepted])

  return (
    <div>
      <p>hello</p>
    </div>
  )
}

export default Child
