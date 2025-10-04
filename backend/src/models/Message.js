const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Message {
  static async create(messageData) {
    const { content, channel_id, user_id, message_type = 'text', file_url = null } = messageData;
    const id = uuidv4();
    
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO messages (id, content, channel_id, user_id, message_type, file_url) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id, content, channel_id, user_id, message_type, file_url],
        function(err) {
          if (err) {
            reject(err);
          } else {
            // Get the created message with user info
            db.get(
              `SELECT m.*, u.username, u.avatar
               FROM messages m
               JOIN users u ON m.user_id = u.id
               WHERE m.id = ?`,
              [id],
              (err, row) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(row);
                }
              }
            );
          }
        }
      );
    });
  }

  static async getByChannel(channelId, limit = 50, offset = 0) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT m.*, u.username, u.avatar
         FROM messages m
         JOIN users u ON m.user_id = u.id
         WHERE m.channel_id = ?
         ORDER BY m.created_at DESC
         LIMIT ? OFFSET ?`,
        [channelId, limit, offset],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows.reverse()); // Return in chronological order
          }
        }
      );
    });
  }

  static async delete(messageId, userId) {
    return new Promise((resolve, reject) => {
      db.run(
        "DELETE FROM messages WHERE id = ? AND user_id = ?",
        [messageId, userId],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.changes > 0);
          }
        }
      );
    });
  }

  static async getRecentMessages(userId, limit = 20) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT m.*, u.username, u.avatar, c.name as channel_name
         FROM messages m
         JOIN users u ON m.user_id = u.id
         JOIN channels c ON m.channel_id = c.id
         JOIN channel_members cm ON c.id = cm.channel_id
         WHERE cm.user_id = ?
         ORDER BY m.created_at DESC
         LIMIT ?`,
        [userId, limit],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }
}

module.exports = Message;