import React, { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'

const SocketContext = createContext()

export function useSocket() {
  return useContext(SocketContext)
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      const newSocket = io('http://localhost:5000', {
        auth: {
          token: localStorage.getItem('token')
        }
      })

      newSocket.on('connect', () => {
        console.log('Connected to server')
        setIsConnected(true)
        
        // Join user's personal room
        newSocket.emit('join_user', user.id)
      })

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server')
        setIsConnected(false)
      })

      newSocket.on('connect_error', (error) => {
        console.error('Connection error:', error)
        setIsConnected(false)
      })

      setSocket(newSocket)

      return () => {
        newSocket.close()
      }
    } else {
      if (socket) {
        socket.close()
        setSocket(null)
        setIsConnected(false)
      }
    }
  }, [user])

  const value = {
    socket,
    isConnected
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}