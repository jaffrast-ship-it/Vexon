const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Middleware to check if user is authenticated
function requireAuth(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/auth/login');
}

// Middleware to check if user is admin
function requireAdmin(req, res, next) {
  if (req.session.role === 'admin' || req.session.role === 'owner') {
    return next();
  }
  res.status(403).send('Access denied');
}

// Middleware to check if user is owner
function requireOwner(req, res, next) {
  if (req.session.role === 'owner') {
    return next();
  }
  res.status(403).send('Access denied');
}

// Home page
router.get('/', (req, res) => {
  Product.findAll((err, products) => {
    if (err) return res.status(500).send('Database error');
    res.render('index', { 
      products, 
      user: req.session.userId ? { id: req.session.userId, role: req.session.role } : null 
    });
  });
});

// Category pages
router.get('/men', (req, res) => {
  Product.findByCategory('men', (err, products) => {
    if (err) return res.status(500).send('Database error');
    res.render('category', { 
      category: 'men', 
      products, 
      user: req.session.userId ? { id: req.session.userId, role: req.session.role } : null 
    });
  });
});

router.get('/women', (req, res) => {
  Product.findByCategory('women', (err, products) => {
    if (err) return res.status(500).send('Database error');
    res.render('category', { 
      category: 'women', 
      products, 
      user: req.session.userId ? { id: req.session.userId, role: req.session.role } : null 
    });
  });
});

router.get('/kids', (req, res) => {
  Product.findByCategory('kids', (err, products) => {
    if (err) return res.status(500).send('Database error');
    res.render('category', { 
      category: 'kids', 
      products, 
      user: req.session.userId ? { id: req.session.userId, role: req.session.role } : null 
    });
  });
});

// Product detail page
router.get('/product/:id', (req, res) => {
  Product.findById(req.params.id, (err, product) => {
    if (err) return res.status(500).send('Database error');
    if (!product) return res.status(404).send('Product not found');
    res.render('product', { 
      product, 
      user: req.session.userId ? { id: req.session.userId, role: req.session.role } : null 
    });
  });
});

// Contact page
router.get('/contact', (req, res) => {
  res.render('contact', { 
    user: req.session.userId ? { id: req.session.userId, role: req.session.role } : null 
  });
});

// About page
router.get('/about', (req, res) => {
  res.render('about', { 
    user: req.session.userId ? { id: req.session.userId, role: req.session.role } : null 
  });
});

// Cart page (for now, just render)
router.get('/cart', (req, res) => {
  res.render('cart', { 
    user: req.session.userId ? { id: req.session.userId, role: req.session.role } : null 
  });
});

// Customer dashboard
router.get('/dashboard', requireAuth, (req, res) => {
  res.render('dashboard', { 
    user: { id: req.session.userId, role: req.session.role } 
  });
});

module.exports = router;