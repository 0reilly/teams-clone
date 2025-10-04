const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Channel {
  static async create(channelData) {
    const { name, description, created_by, is_private = false } = channelData;
    const id = uuidv4();
    
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO channels (id, name, description, created_by, is_private) VALUES (?, ?, ?, ?, ?)`,
        [id, name, description, created_by, is_private],
        function(err) {
          if (err) {
            reject(err);
          } else {
            // Add creator as member
            db.run(
              "INSERT INTO channel_members (channel_id, user_id) VALUES (?, ?)",
              [id, created_by],
              function(err) {
                if (err) {
                  reject(err);
                } else {
                  resolve({ id, name, description, created_by, is_private });
                }
              }
            );
          }
        }
      );
    });
  }

  static async getAll() {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT c.*, u.username as created_by_username, 
                COUNT(cm.user_id) as member_count
         FROM channels c
         LEFT JOIN users u ON c.created_by = u.id
         LEFT JOIN channel_members cm ON c.id = cm.channel_id
         GROUP BY c.id
         ORDER BY c.name`,
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

  static async findById(id) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT c.*, u.username as created_by_username
         FROM channels c
         LEFT JOIN users u ON c.created_by = u.id
         WHERE c.id = ?`,
        [id],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  }

  static async addMember(channelId, userId) {
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT OR IGNORE INTO channel_members (channel_id, user_id) VALUES (?, ?)",
        [channelId, userId],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  static async getMembers(channelId) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT u.id, u.username, u.email, u.avatar, u.online_status
         FROM channel_members cm
         JOIN users u ON cm.user_id = u.id
         WHERE cm.channel_id = ?
         ORDER BY u.username`,
        [channelId],
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

  static async getUserChannels(userId) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT c.*, u.username as created_by_username,
                COUNT(cm2.user_id) as member_count
         FROM channel_members cm
         JOIN channels c ON cm.channel_id = c.id
         LEFT JOIN users u ON c.created_by = u.id
         LEFT JOIN channel_members cm2 ON c.id = cm2.channel_id
         WHERE cm.user_id = ?
         GROUP BY c.id
         ORDER BY c.name`,
        [userId],
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

module.exports = Channel;