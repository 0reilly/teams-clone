const db = require('../config/database');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

class User {
  static async create(userData) {
    const { email, username, password } = userData;
    const id = uuidv4();
    const password_hash = await bcrypt.hash(password, 12);
    
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO users (id, email, username, password_hash) VALUES (?, ?, ?, ?)`,
        [id, email, username, password_hash],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id, email, username });
          }
        }
      );
    });
  }

  static async findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM users WHERE email = ?",
        [email],
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

  static async findById(id) {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT id, email, username, avatar, online_status, last_seen, created_at FROM users WHERE id = ?",
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

  static async updateOnlineStatus(id, online) {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE users SET online_status = ?, last_seen = CURRENT_TIMESTAMP WHERE id = ?",
        [online, id],
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

  static async getAllUsers() {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT id, email, username, avatar, online_status, last_seen FROM users ORDER BY username",
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

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;