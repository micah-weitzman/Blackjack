import React, { useState } from 'react'
import SimpleChat from 'react-simple-chat'

import 'react-simple-chat/src/components/index.css'

const Chat = ({ messages, sendChat, gameID }) => (
  <div
    style={{
      posistion: 'fixed',
    }}
  >
    <SimpleChat
      title={`Room #${gameID + 1}`}
      user={{ id: 1 }}
      messages={messages}
      onSend={sendChat}
    />
  </div>
)

export default Chat
