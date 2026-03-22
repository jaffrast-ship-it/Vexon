const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Login page
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// Signup page
router.get('/signup', (req, res) => {
  res.render('signup', { error: null });
});

// Login POST
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  User.authenticate(email, password, (err, user) => {
    if (err) return res.status(500).send('Database error');
    if (!user) {
      return res.render('login', { error: 'Invalid email or password' });
    }
    req.session.userId = user.id;
    req.session.role = user.role;
    if (user.role === 'admin' || user.role === 'owner') {
      res.redirect('/admin');
    } else {
      res.redirect('/dashboard');
    }
  });
});

// Signup POST
router.post('/signup', (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.render('signup', { error: 'Passwords do not match' });
  }
  User.create({ username, email, password }, (err, userId) => {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.render('signup', { error: 'Email or username already exists' });
      }
      return res.status(500).send('Database error');
    }
    req.session.userId = userId;
    req.session.role = 'customer';
    res.redirect('/dashboard');
  });
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send('Error logging out');
    res.redirect('/');
  });
});

module.exports = router;