# Development Guide

## Development Setup

### Prerequisites
- Node.js 16+ (recommended: 18+)
- npm or yarn
- Git

### Local Development

1. **Clone and setup**
   ```bash
   git clone https://github.com/0reilly/teams-clone.git
   cd teams-clone
   ```

2. **Backend setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Create environment file
   npm run dev
   ```

3. **Frontend setup** (new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:5000

## Project Structure

```
teams-clone/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── ChatArea.jsx  # Main chat interface
│   │   │   ├── Dashboard.jsx # Main dashboard
│   │   │   ├── Login.jsx     # Authentication
│   │   │   ├── Sidebar.jsx   # Channel sidebar
│   │   │   ├── UserProfile.jsx # User profile modal
│   │   │   └── VideoCall.jsx # Video call interface
│   │   ├── contexts/         # React contexts
│   │   │   ├── AuthContext.jsx # Authentication state
│   │   │   └── SocketContext.jsx # Socket.IO connection
│   │   ├── services/         # API services
│   │   │   └── api.js        # Axios API client
│   │   ├── utils/            # Utility functions
│   │   │   └── webrtc.js     # WebRTC management
│   │   ├── App.jsx          # Main App component
│   │   ├── main.jsx         # React entry point
│   │   └── index.css        # Global styles
│   ├── public/              # Static assets
│   ├── dist/               # Production build
│   ├── package.json
│   └── vite.config.js      # Vite configuration
├── backend/                 # Node.js backend server
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   │   └── database.js # SQLite database setup
│   │   ├── models/         # Data models
│   │   │   ├── User.js     # User model
│   │   │   ├── Channel.js  # Channel model
│   │   │   └── Message.js  # Message model
│   │   ├── routes/         # API routes
│   │   │   ├── auth.js     # Authentication routes
│   │   │   ├── users.js    # User routes
│   │   │   ├── channels.js # Channel routes
│   │   │   └── messages.js # Message routes
│   │   └── server.js       # Main server file
│   ├── data/               # SQLite database files
│   ├── package.json
│   └── .env               # Environment variables
├── docs/                  # Documentation
├── logs/                 # Application logs
└── deployment/           # Deployment configurations
```

## Technology Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Styled Components** - CSS-in-JS styling
- **React Router** - Client-side routing
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.IO** - Real-time WebSocket communication
- **SQLite** - Database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  avatar TEXT,
  online_status BOOLEAN DEFAULT FALSE,
  last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Channels Table
```sql
CREATE TABLE channels (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_by TEXT NOT NULL,
  is_private BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users (id)
);
```

### Channel Members Table
```sql
CREATE TABLE channel_members (
  channel_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (channel_id, user_id),
  FOREIGN KEY (channel_id) REFERENCES channels (id),
  FOREIGN KEY (user_id) REFERENCES users (id)
);
```

### Messages Table
```sql
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  file_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (channel_id) REFERENCES channels (id),
  FOREIGN KEY (user_id) REFERENCES users (id)
);
```

## Development Workflow

### Adding New Features

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Implement changes**
   - Follow the existing code structure
   - Add tests if applicable
   - Update documentation

3. **Test thoroughly**
   - Test frontend and backend
   - Test real-time features
   - Test error scenarios

4. **Create pull request**
   - Describe the feature
   - Include screenshots if UI changes
   - Reference any related issues

### Code Style

#### Frontend (React)
- Use functional components with hooks
- Follow React best practices
- Use styled-components for styling
- Keep components small and focused
- Use TypeScript for new components (optional)

#### Backend (Node.js)
- Use async/await for asynchronous operations
- Follow REST API conventions
- Use proper error handling
- Validate all inputs
- Use environment variables for configuration

### Testing

#### Backend Testing
```bash
cd backend
npm test
```

#### Frontend Testing
```bash
cd frontend
npm test
```

## Real-time Features

### Socket.IO Implementation

The application uses Socket.IO for real-time features:

1. **Connection Setup**
   ```javascript
   // Frontend
   const socket = io('http://localhost:5000', {
     auth: { token: userToken }
   });
   ```

2. **Channel Management**
   - Users join channels when selected
   - Messages are broadcast to channel members
   - Typing indicators are shared in real-time

3. **Video Calling**
   - WebRTC peer-to-peer connections
   - Socket.IO for signaling
   - Support for multiple participants

### WebRTC Implementation

Video calling uses WebRTC with Socket.IO signaling:

1. **Offer/Answer Exchange**
2. **ICE Candidate Exchange**
3. **Media Stream Management**
4. **Peer Connection Management**

## Security Considerations

### Authentication
- JWT tokens with expiration
- Secure password hashing with bcrypt
- Token validation on protected routes

### Input Validation
- Validate all user inputs
- Sanitize data before storage
- Use parameterized queries for database

### CORS Configuration
- Configured for specific origins
- Credentials allowed for authenticated requests

## Performance Optimization

### Frontend
- Code splitting with React.lazy
- Optimized bundle size with Vite
- Efficient re-renders with React.memo
- Debounced API calls

### Backend
- Database connection pooling
- Caching for frequent queries
- Rate limiting for API endpoints
- Efficient SQL queries

## Troubleshooting

### Common Issues

**Socket.IO Connection Issues**
- Check CORS configuration
- Verify token authentication
- Check network connectivity

**Database Issues**
- Ensure data directory exists and is writable
- Check file permissions
- Verify database schema

**Build Issues**
- Clear node_modules and reinstall
- Check Node.js version compatibility
- Verify environment variables

### Debugging

**Backend Debugging**
```bash
# Enable debug logging
DEBUG=* npm run dev

# Check logs
pm2 logs teams-clone-backend
```

**Frontend Debugging**
```bash
# Development mode with source maps
npm run dev

# Check browser console for errors
```

## Contributing Guidelines

1. **Code Quality**
   - Write clean, readable code
   - Add comments for complex logic
   - Follow existing patterns

2. **Documentation**
   - Update README for new features
   - Add API documentation
   - Include code examples

3. **Testing**
   - Add unit tests for new features
   - Test edge cases
   - Verify real-time functionality

4. **Security**
   - Never commit sensitive data
   - Follow security best practices
   - Validate all user inputs

## Deployment Checklist

Before deploying to production:

- [ ] Update environment variables
- [ ] Set strong JWT secret
- [ ] Configure CORS for production domain
- [ ] Enable rate limiting
- [ ] Set up logging
- [ ] Test all features
- [ ] Verify database migrations
- [ ] Configure SSL/TLS
- [ ] Set up monitoring
- [ ] Create backup strategy