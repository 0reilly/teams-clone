# Microsoft Teams Clone

A full production-ready Microsoft Teams clone built with React, Node.js, Socket.IO, and WebRTC. Features real-time messaging, video calling, channel management, and user authentication.

## 🚀 Features

- **Real-time Messaging**: Instant messaging with Socket.IO
- **Video Calling**: WebRTC-based video/audio calls
- **Channel Management**: Create and join channels
- **User Authentication**: JWT-based authentication
- **Responsive UI**: Teams-like interface with modern design
- **File Sharing**: Support for file uploads (ready for implementation)
- **User Presence**: Online/offline status indicators

## 🏗️ Architecture

- **Frontend**: React 18 + Vite + Styled Components
- **Backend**: Node.js + Express + Socket.IO
- **Database**: SQLite with proper schemas
- **Real-time**: Socket.IO for messaging and WebRTC signaling
- **Authentication**: JWT tokens with bcrypt password hashing

## 📦 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/0reilly/teams-clone.git
   cd teams-clone
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   npm run dev
   ```

3. **Setup Frontend** (in new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:5000

## 🚀 Production Deployment

### Option 1: PM2 Deployment (Recommended for VPS)

1. **Run the deployment script**
   ```bash
   ./start-production.sh
   ```

2. **Configure firewall**
   ```bash
   sudo ufw allow 3001  # Frontend
   sudo ufw allow 5000  # Backend API
   ```

3. **Access your application**
   - Frontend: http://your-server-ip:3001
   - API: http://your-server-ip:5000

### Option 2: Docker Deployment

1. **Using Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Build and run manually**
   ```bash
   docker build -t teams-clone .
   docker run -p 3001:3001 -p 5000:5000 teams-clone
   ```

### Option 3: Manual PM2 Setup

1. **Install dependencies**
   ```bash
   cd backend && npm ci --production && cd ..
   cd frontend && npm ci --production && npm run build && cd ..
   ```

2. **Start with PM2**
   ```bash
   pm2 start ecosystem.config.js --env production
   pm2 save
   pm2 startup
   ```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```
PORT=5000
JWT_SECRET=your-super-secret-key
FRONTEND_URL=http://localhost:3001
NODE_ENV=production
```

### Port Configuration

- **Frontend**: 3001 (configurable in `frontend/vite.config.js`)
- **Backend**: 5000 (configurable in `backend/.env`)

## 📁 Project Structure

```
teams-clone/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── contexts/         # React contexts
│   │   ├── services/         # API services
│   │   └── utils/            # Utility functions
│   └── dist/                 # Production build
├── backend/                  # Node.js backend
│   ├── src/
│   │   ├── config/          # Database config
│   │   ├── models/          # Data models
│   │   ├── routes/          # API routes
│   │   └── server.js        # Main server file
│   └── data/                # SQLite database
├── ecosystem.config.js      # PM2 configuration
├── docker-compose.yml       # Docker compose
├── Dockerfile              # Docker configuration
└── deploy.sh              # Deployment script
```

## 🔐 Security Features

- JWT authentication with secure token storage
- Password hashing with bcrypt
- CORS configuration
- Rate limiting
- Helmet security headers
- Input validation
- SQL injection protection

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Channels
- `GET /api/channels` - Get all channels
- `POST /api/channels` - Create channel
- `GET /api/channels/:id` - Get channel details
- `GET /api/channels/:id/members` - Get channel members

### Messages
- `GET /api/messages/channel/:channelId` - Get channel messages
- `POST /api/messages` - Send message
- `DELETE /api/messages/:id` - Delete message

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID

## 🔄 Real-time Events

### Socket.IO Events
- `join_channel` - Join a channel
- `leave_channel` - Leave a channel
- `send_message` - Send a message
- `typing_start` - User started typing
- `typing_stop` - User stopped typing
- `start_video_call` - Start video call
- `call_user` - WebRTC call signaling

## 🛠️ Development

### Running Tests
```bash
# Backend tests
cd backend && npm test

# Frontend tests  
cd frontend && npm test
```

### Building for Production
```bash
cd frontend && npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

**Port already in use**
- Change ports in configuration files
- Kill existing processes: `lsof -ti:3001 | xargs kill -9`

**Database errors**
- Ensure `backend/data` directory exists and is writable
- Check SQLite file permissions

**CORS errors**
- Verify `FRONTEND_URL` in backend `.env` matches your frontend URL

**Socket.IO connection issues**
- Check that both frontend and backend are running
- Verify CORS configuration

### Getting Help
- Check the logs: `pm2 logs`
- Verify services are running: `pm2 status`
- Test API endpoints: `curl http://localhost:5000/health`

## 🔮 Roadmap

- [ ] File upload and sharing
- [ ] Screen sharing in video calls
- [ ] Message reactions
- [ ] Threaded conversations
- [ ] Mobile app
- [ ] Advanced user roles
- [ ] Integration with calendar
- [ ] Notifications system