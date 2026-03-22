const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Middleware to check if user is owner
function requireOwner(req, res, next) {
  if (req.session.role === 'owner') {
    return next();
  }
  res.status(403).send('Access denied');
}

// Owner dashboard
router.get('/', requireOwner, (req, res) => {
  User.findAll((err, users) => {
    if (err) return res.status(500).send('Database error');
    res.render('owner/dashboard', { 
      users, 
      user: { id: req.session.userId, role: req.session.role },
      success: req.query.success || null
    });
  });
});

// Create admin
router.post('/admins', requireOwner, (req, res) => {
  const { username, email, password } = req.body;
  User.create({ username, email, password, role: 'admin' }, (err, userId) => {
    if (err) return res.status(500).send('Database error');
    res.redirect('/owner?success=Admin created successfully');
  });
});

// Update user role
router.put('/users/:id/role', requireOwner, (req, res) => {
  const { role } = req.body;
  User.updateRole(req.params.id, role, (err) => {
    if (err) return res.status(500).send('Database error');
    res.redirect('/owner?success=User role updated successfully');
  });
});

// Delete user
router.delete('/users/:id', requireOwner, (req, res) => {
  User.delete(req.params.id, (err) => {
    if (err) return res.status(500).send('Database error');
    res.redirect('/owner?success=User deleted successfully');
  });
});

module.exports = router;