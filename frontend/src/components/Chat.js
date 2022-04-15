import React, { useState } from 'react'

const styles = {
  main: {

  },
  message: {
    margin: 0,
    padding: 0,
  },
}

const Chat = ({ chats, sendMessage }) => {
  const [msg, setMsg] = useState('')

  const sendMsg = () => {
    sendMessage(msg)
    setMsg('')
  }
  return (
    <div style={styles.main}>
      {chats.map(({ message, name, date }) => (
        <li style={styles.message}>
          {`${name}:${message}`}
        </li>
      ))}
      <form id="form" action="">
        <input id="input" value={msg} onChange={e => setMsg(e.target)} />
        <button type="button" onClick={() => sendMsg()}>Send</button>
      </form>
    </div>
  )
}

export default Chat
