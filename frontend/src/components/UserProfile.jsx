import React, { useState } from 'react'
import styled from 'styled-components'
import { FiUser, FiMail, FiCalendar, FiEdit2, FiCheck } from 'react-icons/fi'

const ProfileContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 360px;
  background: white;
  border-left: 1px solid #E1E5F2;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
  display: flex;
  flex-direction: column;
`

const ProfileHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #E1E5F2;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ProfileTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  padding: 4px;
  border-radius: 4px;

  &:hover {
    background: #f5f5f5;
  }
`

const ProfileContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #464EB8;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 16px;
`

const UserName = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
`

const UserEmail = styled.p`
  color: #666;
  margin: 0;
  font-size: 14px;
`

const InfoSection = styled.div`
  margin-bottom: 30px;
`

const SectionTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
`

const InfoIcon = styled.div`
  color: #666;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const InfoContent = styled.div`
  flex: 1;
`

const InfoLabel = styled.div`
  font-size: 12px;
  color: #999;
  margin-bottom: 2px;
`

const InfoValue = styled.div`
  font-size: 14px;
  color: #333;
`

const EditInput = styled.input`
  border: 1px solid #E1E5F2;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #464EB8;
  }
`

const EditButton = styled.button`
  background: none;
  border: none;
  color: #464EB8;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;

  &:hover {
    background: rgba(70, 78, 184, 0.1);
  }
`

function UserProfile({ user, onClose }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(user?.username || '')

  const handleSave = () => {
    // In a real app, this would call an API to update the user
    setIsEditing(false)
    // Update user context/store with new name
  }

  const getInitials = (username) => {
    return username ? username.charAt(0).toUpperCase() : '?'
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfileTitle>Profile</ProfileTitle>
        <CloseButton onClick={onClose}>×</CloseButton>
      </ProfileHeader>

      <ProfileContent>
        <AvatarSection>
          <Avatar>
            {getInitials(user?.username)}
          </Avatar>
          {isEditing ? (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <EditInput
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="Enter your name"
              />
              <EditButton onClick={handleSave}>
                <FiCheck size={14} />
                Save
              </EditButton>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <UserName>{user?.username}</UserName>
              <UserEmail>{user?.email}</UserEmail>
              <EditButton onClick={() => setIsEditing(true)}>
                <FiEdit2 size={12} />
                Edit name
              </EditButton>
            </div>
          )}
        </AvatarSection>

        <InfoSection>
          <SectionTitle>Contact Information</SectionTitle>
          
          <InfoItem>
            <InfoIcon>
              <FiMail size={16} />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>Email</InfoLabel>
              <InfoValue>{user?.email}</InfoValue>
            </InfoContent>
          </InfoItem>

          <InfoItem>
            <InfoIcon>
              <FiUser size={16} />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>Username</InfoLabel>
              <InfoValue>{user?.username}</InfoValue>
            </InfoContent>
          </InfoItem>
        </InfoSection>

        <InfoSection>
          <SectionTitle>Account Information</SectionTitle>
          
          <InfoItem>
            <InfoIcon>
              <FiCalendar size={16} />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>Member since</InfoLabel>
              <InfoValue>
                {user?.created_at ? formatDate(user.created_at) : 'N/A'}
              </InfoValue>
            </InfoContent>
          </InfoItem>

          <InfoItem>
            <InfoIcon>
              <FiUser size={16} />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>Status</InfoLabel>
              <InfoValue>
                <span style={{ 
                  color: user?.online_status ? '#27ae60' : '#95a5a6',
                  fontWeight: '500'
                }}>
                  {user?.online_status ? 'Online' : 'Offline'}
                </span>
              </InfoValue>
            </InfoContent>
          </InfoItem>
        </InfoSection>
      </ProfileContent>
    </ProfileContainer>
  )
}

export default UserProfile