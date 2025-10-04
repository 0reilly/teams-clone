const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../data/teams.db');

// Create data directory if it doesn't exist
const fs = require('fs');
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    avatar TEXT,
    online_status BOOLEAN DEFAULT FALSE,
    last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Channels table
  db.run(`CREATE TABLE IF NOT EXISTS channels (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_by TEXT NOT NULL,
    is_private BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users (id)
  )`);

  // Channel members table
  db.run(`CREATE TABLE IF NOT EXISTS channel_members (
    channel_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (channel_id, user_id),
    FOREIGN KEY (channel_id) REFERENCES channels (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Messages table
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    channel_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    message_type TEXT DEFAULT 'text',
    file_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (channel_id) REFERENCES channels (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Calls table
  db.run(`CREATE TABLE IF NOT EXISTS calls (
    id TEXT PRIMARY KEY,
    channel_id TEXT NOT NULL,
    participants TEXT, -- JSON array of user IDs
    start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    end_time DATETIME,
    duration INTEGER,
    FOREIGN KEY (channel_id) REFERENCES channels (id)
  )`);

  // Create default channels
  db.get("SELECT COUNT(*) as count FROM channels", (err, row) => {
    if (err) {
      console.error('Error checking channels:', err);
      return;
    }
    
    if (row.count === 0) {
      const { v4: uuidv4 } = require('uuid');
      const defaultChannels = [
        { id: uuidv4(), name: 'general', description: 'General discussion', created_by: 'system' },
        { id: uuidv4(), name: 'random', description: 'Random topics', created_by: 'system' },
        { id: uuidv4(), name: 'help', description: 'Help and support', created_by: 'system' }
      ];
      
      const stmt = db.prepare("INSERT INTO channels (id, name, description, created_by) VALUES (?, ?, ?, ?)");
      defaultChannels.forEach(channel => {
        stmt.run([channel.id, channel.name, channel.description, channel.created_by]);
      });
      stmt.finalize();
      console.log('Default channels created');
    }
  });
}

module.exports = db;