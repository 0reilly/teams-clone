# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Register User

**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username"
  }
}
```

### Login User

**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username",
    "avatar": null,
    "online_status": true
  }
}
```

### Get Current User

**GET** `/auth/me`

Get current authenticated user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username",
    "avatar": null,
    "online_status": true,
    "last_seen": "2024-01-01T12:00:00.000Z",
    "created_at": "2024-01-01T12:00:00.000Z"
  }
}
```

## Users

### Get All Users

**GET** `/users`

Get list of all users.

**Response:**
```json
{
  "users": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "username": "username",
      "avatar": null,
      "online_status": true,
      "last_seen": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

### Get User by ID

**GET** `/users/:id`

Get specific user information.

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username",
    "avatar": null,
    "online_status": true,
    "last_seen": "2024-01-01T12:00:00.000Z",
    "created_at": "2024-01-01T12:00:00.000Z"
  }
}
```

## Channels

### Get All Channels

**GET** `/channels`

Get list of all channels.

**Response:**
```json
{
  "channels": [
    {
      "id": "uuid",
      "name": "general",
      "description": "General discussion",
      "created_by": "system",
      "is_private": false,
      "created_at": "2024-01-01T12:00:00.000Z",
      "created_by_username": null,
      "member_count": 5
    }
  ]
}
```

### Get Channel by ID

**GET** `/channels/:id`

Get specific channel information.

**Response:**
```json
{
  "channel": {
    "id": "uuid",
    "name": "general",
    "description": "General discussion",
    "created_by": "system",
    "is_private": false,
    "created_at": "2024-01-01T12:00:00.000Z",
    "created_by_username": null
  }
}
```

### Create Channel

**POST** `/channels`

Create a new channel.

**Request Body:**
```json
{
  "name": "new-channel",
  "description": "Channel description",
  "created_by": "user-uuid",
  "is_private": false
}
```

**Response:**
```json
{
  "message": "Channel created successfully",
  "channel": {
    "id": "uuid",
    "name": "new-channel",
    "description": "Channel description",
    "created_by": "user-uuid",
    "is_private": false
  }
}
```

### Get Channel Members

**GET** `/channels/:id/members`

Get list of channel members.

**Response:**
```json
{
  "members": [
    {
      "id": "uuid",
      "username": "username",
      "email": "user@example.com",
      "avatar": null,
      "online_status": true
    }
  ]
}
```

### Add Member to Channel

**POST** `/channels/:id/members`

Add user to channel.

**Request Body:**
```json
{
  "user_id": "user-uuid"
}
```

**Response:**
```json
{
  "message": "User added to channel successfully"
}
```

## Messages

### Get Channel Messages

**GET** `/messages/channel/:channelId`

Get messages for a specific channel.

**Query Parameters:**
- `limit` (optional): Number of messages to return (default: 50)
- `offset` (optional): Number of messages to skip (default: 0)

**Response:**
```json
{
  "messages": [
    {
      "id": "uuid",
      "content": "Hello world!",
      "channel_id": "channel-uuid",
      "user_id": "user-uuid",
      "message_type": "text",
      "file_url": null,
      "created_at": "2024-01-01T12:00:00.000Z",
      "username": "username",
      "avatar": null
    }
  ]
}
```

### Send Message

**POST** `/messages`

Send a new message to a channel.

**Request Body:**
```json
{
  "content": "Hello world!",
  "channel_id": "channel-uuid",
  "user_id": "user-uuid",
  "message_type": "text",
  "file_url": null
}
```

**Response:**
```json
{
  "message": "Message sent successfully",
  "data": {
    "id": "uuid",
    "content": "Hello world!",
    "channel_id": "channel-uuid",
    "user_id": "user-uuid",
    "message_type": "text",
    "file_url": null,
    "created_at": "2024-01-01T12:00:00.000Z",
    "username": "username",
    "avatar": null
  }
}
```

### Delete Message

**DELETE** `/messages/:id`

Delete a message (only by the message author).

**Request Body:**
```json
{
  "user_id": "user-uuid"
}
```

**Response:**
```json
{
  "message": "Message deleted successfully"
}
```

## Health Check

### Health Status

**GET** `/health`

Check if the API is running.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "version": "1.0.0"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "error": "Access denied. No token provided."
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Rate Limiting

The API implements rate limiting:
- 100 requests per 15 minutes per IP address
- Applies to all endpoints except health check

## Socket.IO Events

### Client to Server Events

- `join_user` - Join user's personal room
  ```javascript
  socket.emit('join_user', userId)
  ```

- `join_channel` - Join a channel
  ```javascript
  socket.emit('join_channel', channelId)
  ```

- `leave_channel` - Leave a channel
  ```javascript
  socket.emit('leave_channel', channelId)
  ```

- `send_message` - Send a message
  ```javascript
  socket.emit('send_message', {
    content: "Message content",
    channel_id: "channel-uuid",
    user_id: "user-uuid",
    message_type: "text"
  })
  ```

- `typing_start` - User started typing
  ```javascript
  socket.emit('typing_start', {
    user_id: "user-uuid",
    username: "username",
    channel_id: "channel-uuid"
  })
  ```

- `typing_stop` - User stopped typing
  ```javascript
  socket.emit('typing_stop', {
    user_id: "user-uuid",
    channel_id: "channel-uuid"
  })
  ```

- `start_video_call` - Start video call
  ```javascript
  socket.emit('start_video_call', {
    channel_id: "channel-uuid"
  })
  ```

### Server to Client Events

- `new_message` - New message received
  ```javascript
  socket.on('new_message', (message) => {
    // Handle new message
  })
  ```

- `channel_activity` - Channel activity update
  ```javascript
  socket.on('channel_activity', (data) => {
    // Handle channel activity
  })
  ```

- `user_typing` - User typing indicator
  ```javascript
  socket.on('user_typing', (data) => {
    // Handle typing indicator
  })
  ```

- `user_stop_typing` - User stopped typing
  ```javascript
  socket.on('user_stop_typing', (data) => {
    // Handle stop typing
  })
  ```

- `video_call_started` - Video call started
  ```javascript
  socket.on('video_call_started', (data) => {
    // Handle video call
  })
  ```