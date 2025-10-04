import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { FiSend, FiVideo, FiMoreVertical } from 'react-icons/fi'
import { messagesAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { useSocket } from '../contexts/SocketContext'

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
`

const ChatHeader = styled.div`
  padding: 16px 24px;
  border-bottom: 1px solid #E1E5F2;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ChannelInfo = styled.div`
  display: flex;
  flex-direction: column;
`

const ChannelName = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
`

const ChannelDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin: 4px 0 0 0;
`

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
`

const ActionButton = styled.button`
  background: #464EB8;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: #3A4194;
  }
`

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Message = styled.div`
  display: flex;
  gap: 12px;
  padding: 8px 0;
`

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #464EB8;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
`

const MessageContent = styled.div`
  flex: 1;
`

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`

const MessageAuthor = styled.span`
  font-weight: 600;
  font-size: 14px;
  color: #333;
`

const MessageTime = styled.span`
  font-size: 12px;
  color: #999;
`

const MessageText = styled.div`
  font-size: 14px;
  line-height: 1.4;
  color: #333;
`

const InputContainer = styled.div`
  padding: 20px 24px;
  border-top: 1px solid #E1E5F2;
  background: #F8F9FA;
`

const InputWrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;
`

const MessageInput = styled.textarea`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #E1E5F2;
  border-radius: 8px;
  font-size: 14px;
  resize: none;
  min-height: 44px;
  max-height: 120px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #464EB8;
  }

  &::placeholder {
    color: #A0A3BD;
  }
`

const SendButton = styled.button`
  background: #464EB8;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: #3A4194;
  }

  &:disabled {
    background: #A0A3BD;
    cursor: not-allowed;
  }
`

const WelcomeMessage = styled.div`
  text-align: center;
  color: #666;
  padding: 40px 20px;
  font-size: 16px;
`

function ChatArea({ channel }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)
  const { user } = useAuth()
  const { socket } = useSocket()

  useEffect(() => {
    if (channel) {
      joinChannel()
      loadMessages()
    }
  }, [channel])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (socket && channel) {
      // Listen for new messages
      socket.on('new_message', (message) => {
        if (message.channel_id === channel.id) {
          setMessages(prev => [...prev, message])
        }
      })

      return () => {
        socket.off('new_message')
      }
    }
  }, [socket, channel])

  const joinChannel = () => {
    if (socket && channel) {
      socket.emit('join_channel', channel.id)
    }
  }

  const leaveChannel = () => {
    if (socket && channel) {
      socket.emit('leave_channel', channel.id)
    }
  }

  const loadMessages = async () => {
    if (!channel) return

    setLoading(true)
    try {
      const response = await messagesAPI.getByChannel(channel.id)
      setMessages(response.data.messages)
    } catch (error) {
      console.error('Failed to load messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !channel || sending) return

    setSending(true)
    try {
      // Send message via Socket.IO for real-time delivery
      socket.emit('send_message', {
        content: newMessage,
        channel_id: channel.id,
        user_id: user.id,
        message_type: 'text'
      })
      
      setNewMessage('')
    } catch (error) {
      console.error('Failed to send message:', error)
      alert('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  useEffect(() => {
    return () => {
      leaveChannel()
    }
  }, [channel])

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getInitials = (username) => {
    return username ? username.charAt(0).toUpperCase() : '?'
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const startVideoCall = () => {
    if (socket) {
      // Emit video call event
      socket.emit('start_video_call', {
        channel_id: channel.id
      })
    }
  }

  if (!channel) {
    return (
      <ChatContainer>
        <WelcomeMessage>
          Select a channel to start chatting
        </WelcomeMessage>
      </ChatContainer>
    )
  }

  return (
    <ChatContainer>
      <ChatHeader>
        <ChannelInfo>
          <ChannelName>#{channel.name}</ChannelName>
          {channel.description && (
            <ChannelDescription>{channel.description}</ChannelDescription>
          )}
        </ChannelInfo>
        
        <HeaderActions>
          <ActionButton onClick={startVideoCall}>
            <FiVideo size={16} />
            Start Call
          </ActionButton>
        </HeaderActions>
      </ChatHeader>

      <MessagesContainer>
        {loading ? (
          <WelcomeMessage>Loading messages...</WelcomeMessage>
        ) : messages.length === 0 ? (
          <WelcomeMessage>
            No messages yet. Be the first to start the conversation!
          </WelcomeMessage>
        ) : (
          messages.map(message => (
            <Message key={message.id}>
              <Avatar>
                {getInitials(message.username)}
              </Avatar>
              <MessageContent>
                <MessageHeader>
                  <MessageAuthor>{message.username}</MessageAuthor>
                  <MessageTime>{formatTime(message.created_at)}</MessageTime>
                </MessageHeader>
                <MessageText>{message.content}</MessageText>
              </MessageContent>
            </Message>
          ))
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <InputContainer>
        <InputWrapper>
          <MessageInput
            placeholder={`Message #${channel.name}`}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={1}
          />
          <SendButton 
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
          >
            <FiSend size={18} />
          </SendButton>
        </InputWrapper>
      </InputContainer>
    </ChatContainer>
  )
}

export default ChatArea