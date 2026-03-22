const db = require('./database');
const bcrypt = require('bcryptjs');

class User {
  static create(userData, callback) {
    const { username, email, password, role = 'customer' } = userData;
    const hashedPassword = bcrypt.hashSync(password, 10);
    db.run(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, role],
      function(err) {
        callback(err, this.lastID);
      }
    );
  }

  static findByEmail(email, callback) {
    db.get('SELECT * FROM users WHERE email = ?', [email], callback);
  }

  static findById(id, callback) {
    db.get('SELECT id, username, email, role, created_at FROM users WHERE id = ?', [id], callback);
  }

  static findAll(callback) {
    db.all('SELECT id, username, email, role, created_at FROM users', callback);
  }

  static updateRole(id, role, callback) {
    db.run('UPDATE users SET role = ? WHERE id = ?', [role, id], callback);
  }

  static delete(id, callback) {
    db.run('DELETE FROM users WHERE id = ?', [id], callback);
  }

  static authenticate(email, password, callback) {
    this.findByEmail(email, (err, user) => {
      if (err || !user) return callback(err, null);
      if (bcrypt.compareSync(password, user.password)) {
        callback(null, user);
      } else {
        callback(null, null);
      }
    });
  }
}

module.exports = User;