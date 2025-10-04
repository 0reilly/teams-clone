import React, { useState } from 'react'
import styled from 'styled-components'
import { FiMessageSquare, FiUsers, FiPlus, FiSearch } from 'react-icons/fi'
import { channelsAPI } from '../services/api'

const SidebarContainer = styled.div`
  width: 260px;
  background: #F8F9FA;
  border-right: 1px solid #E1E5F2;
  display: flex;
  flex-direction: column;
  height: 100vh;
`

const SidebarHeader = styled.div`
  padding: 20px 16px;
  border-bottom: 1px solid #E1E5F2;
`

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 16px;
`

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px 8px 32px;
  border: 1px solid #E1E5F2;
  border-radius: 4px;
  font-size: 14px;
  background: white;

  &:focus {
    outline: none;
    border-color: #464EB8;
  }
`

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #A0A3BD;
`

const Section = styled.div`
  margin-bottom: 24px;
`

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  color: #464EB8;
  font-weight: 600;
  font-size: 14px;
`

const AddButton = styled.button`
  background: none;
  border: none;
  color: #464EB8;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;

  &:hover {
    background: rgba(70, 78, 184, 0.1);
  }
`

const ChannelList = styled.div`
  display: flex;
  flex-direction: column;
`

const ChannelItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-left: 3px solid transparent;

  &:hover {
    background: rgba(70, 78, 184, 0.05);
  }

  ${props => props.selected && `
    background: rgba(70, 78, 184, 0.1);
    border-left-color: #464EB8;
    color: #464EB8;
    font-weight: 500;
  `}
`

const ChannelIcon = styled(FiMessageSquare)`
  color: #666;
  ${props => props.selected && `color: #464EB8;`}
`

const ChannelName = styled.span`
  font-size: 14px;
  flex: 1;
`

const MemberCount = styled.span`
  background: #E1E5F2;
  color: #666;
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
`

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const ModalContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  width: 400px;
  max-width: 90vw;
`

const ModalTitle = styled.h3`
  margin-bottom: 20px;
  color: #333;
`

const ModalInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #E1E5F2;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #464EB8;
  }
`

const ModalTextarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #E1E5F2;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: #464EB8;
  }
`

const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`

const ModalButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;

  &.primary {
    background: #464EB8;
    color: white;

    &:hover {
      background: #3A4194;
    }
  }

  &.secondary {
    background: #F8F9FA;
    color: #666;

    &:hover {
      background: #E1E5F2;
    }
  }
`

function Sidebar({ channels, selectedChannel, onChannelSelect, onChannelCreated }) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newChannel, setNewChannel] = useState({ name: '', description: '' })
  const [loading, setLoading] = useState(false)

  const handleCreateChannel = async () => {
    if (!newChannel.name.trim()) return

    setLoading(true)
    try {
      const response = await channelsAPI.create(newChannel.name, newChannel.description)
      onChannelCreated(response.data.channel)
      setShowCreateModal(false)
      setNewChannel({ name: '', description: '' })
    } catch (error) {
      console.error('Failed to create channel:', error)
      alert('Failed to create channel')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SidebarContainer>
      <SidebarHeader>
        <SearchContainer>
          <SearchIcon size={16} />
          <SearchInput placeholder="Search channels..." />
        </SearchContainer>
      </SidebarHeader>

      <Section>
        <SectionHeader>
          <span>Channels</span>
          <AddButton onClick={() => setShowCreateModal(true)}>
            <FiPlus size={16} />
          </AddButton>
        </SectionHeader>
        
        <ChannelList>
          {channels.map(channel => (
            <ChannelItem
              key={channel.id}
              selected={selectedChannel?.id === channel.id}
              onClick={() => onChannelSelect(channel)}
            >
              <ChannelIcon 
                size={16} 
                selected={selectedChannel?.id === channel.id} 
              />
              <ChannelName>{channel.name}</ChannelName>
              <MemberCount>{channel.member_count}</MemberCount>
            </ChannelItem>
          ))}
        </ChannelList>
      </Section>

      {showCreateModal && (
        <ModalOverlay onClick={() => setShowCreateModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Create New Channel</ModalTitle>
            
            <ModalInput
              type="text"
              placeholder="Channel name"
              value={newChannel.name}
              onChange={(e) => setNewChannel({...newChannel, name: e.target.value})}
            />
            
            <ModalTextarea
              placeholder="Channel description (optional)"
              value={newChannel.description}
              onChange={(e) => setNewChannel({...newChannel, description: e.target.value})}
            />
            
            <ModalButtons>
              <ModalButton 
                className="secondary"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </ModalButton>
              <ModalButton 
                className="primary"
                onClick={handleCreateChannel}
                disabled={loading || !newChannel.name.trim()}
              >
                {loading ? 'Creating...' : 'Create Channel'}
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
    </SidebarContainer>
  )
}

export default Sidebar