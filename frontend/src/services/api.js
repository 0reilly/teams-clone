import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  register: (email, username, password) => 
    api.post('/auth/register', { email, username, password }),
  
  getCurrentUser: () => 
    api.get('/auth/me'),
}

// Users API
export const usersAPI = {
  getAll: () => 
    api.get('/users'),
  
  getById: (id) => 
    api.get(`/users/${id}`),
}

// Channels API
export const channelsAPI = {
  getAll: () => 
    api.get('/channels'),
  
  getById: (id) => 
    api.get(`/channels/${id}`),
  
  create: (name, description, isPrivate = false) => 
    api.post('/channels', { name, description, is_private: isPrivate }),
  
  getMembers: (channelId) => 
    api.get(`/channels/${channelId}/members`),
  
  addMember: (channelId, userId) => 
    api.post(`/channels/${channelId}/members`, { user_id: userId }),
}

// Messages API
export const messagesAPI = {
  getByChannel: (channelId, limit = 50, offset = 0) => 
    api.get(`/messages/channel/${channelId}?limit=${limit}&offset=${offset}`),
  
  create: (content, channelId, messageType = 'text', fileUrl = null) => 
    api.post('/messages', { 
      content, 
      channel_id: channelId, 
      message_type: messageType, 
      file_url: fileUrl 
    }),
  
  delete: (messageId) => 
    api.delete(`/messages/${messageId}`),
}

export default api