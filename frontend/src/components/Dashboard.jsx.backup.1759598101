import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useAuth } from '../contexts/AuthContext'
import Sidebar from './Sidebar'
import ChatArea from './ChatArea'
import { channelsAPI } from '../services/api'

const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
  background: white;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #464EB8;
  color: white;
  border-bottom: 1px solid #E1E5F2;
`

const Title = styled.h1`
  font-size: 20px;
  font-weight: 600;
`

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const UserName = styled.span`
  font-weight: 500;
`

const LogoutButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`

function Dashboard() {
  const { user, logout } = useAuth()
  const [channels, setChannels] = useState([])
  const [selectedChannel, setSelectedChannel] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadChannels()
  }, [])

  const loadChannels = async () => {
    try {
      const response = await channelsAPI.getAll()
      setChannels(response.data.channels)
      
      // Select first channel by default
      if (response.data.channels.length > 0 && !selectedChannel) {
        setSelectedChannel(response.data.channels[0])
      }
    } catch (error) {
      console.error('Failed to load channels:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChannelSelect = (channel) => {
    setSelectedChannel(channel)
  }

  const handleChannelCreated = (newChannel) => {
    setChannels(prev => [...prev, newChannel])
    setSelectedChannel(newChannel)
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading channels...
      </div>
    )
  }

  return (
    <DashboardContainer>
      <Sidebar 
        channels={channels}
        selectedChannel={selectedChannel}
        onChannelSelect={handleChannelSelect}
        onChannelCreated={handleChannelCreated}
      />
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header>
          <Title>
            {selectedChannel ? selectedChannel.name : 'Teams Clone'}
          </Title>
          <UserInfo>
            <UserName>Welcome, {user?.username}</UserName>
            <LogoutButton onClick={logout}>
              Logout
            </LogoutButton>
          </UserInfo>
        </Header>
        
        {selectedChannel ? (
          <ChatArea channel={selectedChannel} />
        ) : (
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            color: '#666',
            fontSize: '18px'
          }}>
            Select a channel to start chatting
          </div>
        )}
      </div>
    </DashboardContainer>
  )
}

export default Dashboard