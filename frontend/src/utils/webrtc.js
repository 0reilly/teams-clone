// WebRTC utility functions for video calling

class WebRTCManager {
  constructor() {
    this.localStream = null
    this.peerConnections = new Map()
    this.remoteStreams = new Map()
    this.socket = null
    this.userId = null
  }

  initialize(socket, userId) {
    this.socket = socket
    this.userId = userId
    this.setupSocketListeners()
  }

  setupSocketListeners() {
    if (!this.socket) return

    // Handle incoming call
    this.socket.on('call_made', async (data) => {
      await this.handleIncomingCall(data)
    })

    // Handle answer to our call
    this.socket.on('answer_made', async (data) => {
      await this.handleAnswer(data)
    })

    // Handle ICE candidates
    this.socket.on('ice_candidate', async (data) => {
      await this.handleIceCandidate(data)
    })

    // Handle call rejection
    this.socket.on('call_rejected', (data) => {
      console.log('Call was rejected')
      // Handle call rejection UI
    })
  }

  async startCall(targetUserId) {
    try {
      // Get local media stream
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })

      // Create peer connection
      const peerConnection = this.createPeerConnection(targetUserId)
      
      // Add local stream to connection
      this.localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, this.localStream)
      })

      // Create and send offer
      const offer = await peerConnection.createOffer()
      await peerConnection.setLocalDescription(offer)

      // Send offer to target user
      this.socket.emit('call_user', {
        offer: offer,
        to: targetUserId
      })

      return true
    } catch (error) {
      console.error('Error starting call:', error)
      return false
    }
  }

  async handleIncomingCall(data) {
    try {
      // Get local media stream
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })

      // Create peer connection
      const peerConnection = this.createPeerConnection(data.socket)
      
      // Add local stream to connection
      this.localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, this.localStream)
      })

      // Set remote description
      await peerConnection.setRemoteDescription(data.offer)

      // Create and send answer
      const answer = await peerConnection.createAnswer()
      await peerConnection.setLocalDescription(answer)

      // Send answer back
      this.socket.emit('make_answer', {
        answer: answer,
        to: data.socket
      })

      return true
    } catch (error) {
      console.error('Error handling incoming call:', error)
      return false
    }
  }

  async handleAnswer(data) {
    const peerConnection = this.peerConnections.get(data.socket)
    if (peerConnection) {
      await peerConnection.setRemoteDescription(data.answer)
    }
  }

  async handleIceCandidate(data) {
    const peerConnection = this.peerConnections.get(data.socket)
    if (peerConnection && data.candidate) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate))
    }
  }

  createPeerConnection(targetSocketId) {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    }

    const peerConnection = new RTCPeerConnection(configuration)

    // Store the connection
    this.peerConnections.set(targetSocketId, peerConnection)

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('ice_candidate', {
          candidate: event.candidate,
          to: targetSocketId
        })
      }
    }

    // Handle incoming remote stream
    peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams
      this.remoteStreams.set(targetSocketId, remoteStream)
      
      // Emit event for UI to update
      this.onRemoteStreamAdded?.(targetSocketId, remoteStream)
    }

    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
      console.log('Connection state:', peerConnection.connectionState)
      
      if (peerConnection.connectionState === 'connected') {
        console.log('Peer connection established')
      } else if (peerConnection.connectionState === 'disconnected' || 
                 peerConnection.connectionState === 'failed') {
        console.log('Peer connection lost')
        this.cleanupConnection(targetSocketId)
      }
    }

    return peerConnection
  }

  cleanupConnection(socketId) {
    const peerConnection = this.peerConnections.get(socketId)
    if (peerConnection) {
      peerConnection.close()
      this.peerConnections.delete(socketId)
      this.remoteStreams.delete(socketId)
    }
  }

  endAllCalls() {
    // Close all peer connections
    this.peerConnections.forEach((connection, socketId) => {
      connection.close()
    })
    
    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop())
      this.localStream = null
    }

    // Clear all maps
    this.peerConnections.clear()
    this.remoteStreams.clear()
  }

  toggleVideo(enabled) {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = enabled
      }
    }
  }

  toggleAudio(enabled) {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = enabled
      }
    }
  }

  // Event handlers
  onRemoteStreamAdded = null
  onConnectionStateChange = null
}

// Create singleton instance
export const webRTCManager = new WebRTCManager()

export default WebRTCManager