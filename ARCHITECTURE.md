# Microsoft Teams Clone - Architecture

## System Architecture

### Frontend (React + TypeScript)
- **React 18** with TypeScript
- **Socket.IO Client** for real-time communication
- **WebRTC** for video/audio calls
- **Styled Components** for Teams-like UI
- **React Router** for navigation

### Backend (Node.js + Express)
- **Express.js** server
- **Socket.IO** for real-time features
- **JWT** authentication
- **SQLite** database
- **bcrypt** for password hashing

### Real-time Features
- **Socket.IO** for messaging and presence
- **WebRTC** for peer-to-peer video calls
- **Simple Peer** for WebRTC abstraction

### Database Schema
- Users: id, email, username, password_hash, avatar, online_status
- Channels: id, name, description, created_by
- Messages: id, content, channel_id, user_id, timestamp, type
- Calls: id, channel_id, participants, start_time, end_time

### Production Deployment
- **PM2** for process management
- **Port 3000** for frontend
- **Port 5000** for backend
- **Nginx** reverse proxy (optional)
- **Environment variables** for configuration

### Security
- JWT token authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation