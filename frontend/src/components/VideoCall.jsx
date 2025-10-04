import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { FiVideo, FiVideoOff, FiPhone, FiMic, FiMicOff, FiUsers } from 'react-icons/fi'
import { useSocket } from '../contexts/SocketContext'

const VideoCallContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  z-index: 1000;
`

const VideoGrid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  padding: 20px;
  overflow: auto;
`

const VideoContainer = styled.div`
  position: relative;
  background: #1a1a1a;
  border-radius: 8px;
  overflow: hidden;
`

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const VideoLabel = styled.div`
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
`

const Controls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
`

const ControlButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.2s;

  &.primary {
    background: #e74c3c;
    color: white;

    &:hover {
      background: #c0392b;
    }
  }

  &.secondary {
    background: #34495e;
    color: white;

    &:hover {
      background: #2c3e50;
    }

    &.active {
      background: #27ae60;
    }

    &.muted {
      background: #e74c3c;
    }
  }
`

const CallInfo = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`

function VideoCall({ channel, onEndCall }) {
  const [isInCall, setIsInCall] = useState(false)
  const [localStream, setLocalStream] = useState(null)
  const [remoteStreams, setRemoteStreams] = useState([])
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [participants, setParticipants] = useState([])
  
  const localVideoRef = useRef(null)
  const remoteVideoRefs = useRef({})
  const { socket } = useSocket()

  useEffect(() => {
    if (isInCall) {
      initializeCall()
    }

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [isInCall])

  const initializeCall = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      
      setLocalStream(stream)
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

      // Simulate participants for demo
      setParticipants([
        { id: 'local', name: 'You', isLocal: true },
        { id: 'remote1', name: 'User 1', isLocal: false },
        { id: 'remote2', name: 'User 2', isLocal: false }
      ])

      // In a real implementation, we would:
      // 1. Create peer connections
      // 2. Exchange SDP offers/answers via Socket.IO
      // 3. Handle ICE candidates
      // 4. Add remote streams

    } catch (error) {
      console.error('Error accessing media devices:', error)
      alert('Unable to access camera/microphone. Please check permissions.')
    }
  }

  const startCall = () => {
    setIsInCall(true)
    
    // Notify other users about the call
    if (socket) {
      socket.emit('start_video_call', {
        channel_id: channel.id
      })
    }
  }

  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
    }
    
    setIsInCall(false)
    setLocalStream(null)
    setRemoteStreams([])
    setParticipants([])
    
    if (onEndCall) {
      onEndCall()
    }
  }

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoEnabled(videoTrack.enabled)
      }
    }
  }

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsAudioEnabled(audioTrack.enabled)
      }
    }
  }

  if (!isInCall) {
    return (
      <VideoCallContainer>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: '100%',
          color: 'white',
          textAlign: 'center'
        }}>
          <FiUsers size={64} style={{ marginBottom: '20px', opacity: 0.7 }} />
          <h2 style={{ marginBottom: '10px' }}>Start Video Call</h2>
          <p style={{ marginBottom: '30px', opacity: 0.8 }}>
            Start a video call in #{channel?.name}
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <ControlButton 
              className="primary" 
              onClick={startCall}
            >
              <FiVideo size={20} />
            </ControlButton>
            <ControlButton 
              className="secondary" 
              onClick={onEndCall}
            >
              Cancel
            </ControlButton>
          </div>
        </div>
      </VideoCallContainer>
    )
  }

  return (
    <VideoCallContainer>
      <CallInfo>
        <FiUsers size={16} />
        {participants.length} participants in call
      </CallInfo>

      <VideoGrid>
        {/* Local video */}
        <VideoContainer>
          <Video 
            ref={localVideoRef}
            autoPlay 
            muted 
          />
          <VideoLabel>You {!isVideoEnabled && '(Video off)'}</VideoLabel>
        </VideoContainer>

        {/* Remote videos - simulated for demo */}
        {participants
          .filter(p => !p.isLocal)
          .map(participant => (
            <VideoContainer key={participant.id}>
              <div style={{
                width: '100%',
                height: '200px',
                background: '#2c3e50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '18px'
              }}>
                <FiUsers size={32} />
              </div>
              <VideoLabel>{participant.name}</VideoLabel>
            </VideoContainer>
          ))}
      </VideoGrid>

      <Controls>
        <ControlButton 
          className={`secondary ${!isAudioEnabled ? 'muted' : ''}`}
          onClick={toggleAudio}
        >
          {isAudioEnabled ? <FiMic size={20} /> : <FiMicOff size={20} />}
        </ControlButton>

        <ControlButton 
          className={`secondary ${!isVideoEnabled ? 'muted' : ''}`}
          onClick={toggleVideo}
        >
          {isVideoEnabled ? <FiVideo size={20} /> : <FiVideoOff size={20} />}
        </ControlButton>

        <ControlButton 
          className="primary"
          onClick={endCall}
        >
          <FiPhone size={20} />
        </ControlButton>
      </Controls>
    </VideoCallContainer>
  )
}

export default VideoCall