const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const channelRoutes = require('./routes/channels');
const messageRoutes = require('./routes/messages');

const User = require('./models/User');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(helmet());
app.use(limiter);
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3001",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/messages', messageRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user to their personal room
  socket.on('join_user', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  // Join channel
  socket.on('join_channel', (channelId) => {
    socket.join(`channel_${channelId}`);
    console.log(`Socket ${socket.id} joined channel ${channelId}`);
  });

  // Leave channel
  socket.on('leave_channel', (channelId) => {
    socket.leave(`channel_${channelId}`);
    console.log(`Socket ${socket.id} left channel ${channelId}`);
  });

  // User presence
  socket.on('user_online', async (userId) => {
    await User.updateOnlineStatus(userId, true);
  });

  // Send message
  socket.on('send_message', async (data) => {
    try {
      const message = await Message.create(data);
      
      // Broadcast to channel
      io.to(`channel_${data.channel_id}`).emit('new_message', message);
      
      // Notify channel members about new activity
      io.to(`channel_${data.channel_id}`).emit('channel_activity', {
        channel_id: data.channel_id,
        last_message: message.content,
        timestamp: message.created_at
      });
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('message_error', { error: 'Failed to send message' });
    }
  });

  // Handle message deletion
  socket.on('delete_message', async (data) => {
    await Message.delete(data.messageId, data.userId);
  });

  // Typing indicator
  socket.on('typing_start', (data) => {
    socket.to(`channel_${data.channel_id}`).emit('user_typing', {
      user_id: data.user_id,
      username: data.username,
      channel_id: data.channel_id
    });
  });

  socket.on('typing_stop', (data) => {
    socket.to(`channel_${data.channel_id}`).emit('user_stop_typing', {
      user_id: data.user_id,
      channel_id: data.channel_id
    });
  });

  // Video call events
  socket.on('start_video_call', (data) => {
    // Notify channel members about video call
    io.to(`channel_${data.channel_id}`).emit('video_call_started', data);
  });

  // Video call signaling
  socket.on('call_user', (data) => {
    socket.to(`user_${data.to}`).emit('call_made', {
      offer: data.offer,
      socket: socket.id
    });
  });

  socket.on('make_answer', (data) => {
    socket.to(data.to).emit('answer_made', {
      socket: socket.id,
      answer: data.answer
    });
  });

  socket.on('call_rejected', (data) => {
    socket.to(data.to).emit('call_rejected', {
      socket: socket.id
    });
  });

  // Handle user going offline
  socket.on('disconnect', async () => {
    // Note: We'd need to track which user this socket belongs to
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Teams Clone Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3001'}`);
  console.log(`🔗 Health check: http://0.0.0.0:${PORT}/health`);
});