const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const db = require('../models/database');
const multer = require('multer');
const path = require('path');

// Middleware to check if user is admin or owner
function requireAdmin(req, res, next) {
  if (req.session.role === 'admin' || req.session.role === 'owner') {
    return next();
  }
  res.status(403).send('Access denied');
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Admin dashboard
router.get('/', requireAdmin, (req, res) => {
  Product.findAll((err, products) => {
    if (err) return res.status(500).send('Database error');
    Product.getCategories((err, categories) => {
      if (err) return res.status(500).send('Database error');
      Product.getSizes((err, sizes) => {
        if (err) return res.status(500).send('Database error');
        res.render('admin/dashboard', { 
          products, 
          categories,
          sizes,
          user: { id: req.session.userId, role: req.session.role },
          success: req.query.success || null
        });
      });
    });
  });
});

// Add product
router.get('/products/add', requireAdmin, (req, res) => {
  res.render('admin/add-product', { 
    user: { id: req.session.userId, role: req.session.role } 
  });
});

router.post('/products', requireAdmin, upload.single('image'), (req, res) => {
  const { id, name, price, category, video, description, tags, stock, sizes } = req.body;
  const image = req.file ? '/uploads/' + req.file.filename : req.body.image;
  const tagsArray = tags ? tags.split(',').map(t => t.trim()) : [];
  const sizesArray = sizes ? sizes.split(',').map(s => s.trim()) : [];

  Product.create({ id, name, price: parseInt(price), category, image, video, description, tags: tagsArray, stock: parseInt(stock), sizes: sizesArray }, (err) => {
    if (err) return res.status(500).send('Database error');
    res.redirect('/admin?success=Product added successfully');
  });
});

// Edit product
router.get('/products/:id/edit', requireAdmin, (req, res) => {
  Product.findById(req.params.id, (err, product) => {
    if (err) return res.status(500).send('Database error');
    if (!product) return res.status(404).send('Product not found');
    res.render('admin/edit-product', { 
      product, 
      user: { id: req.session.userId, role: req.session.role } 
    });
  });
});

router.put('/products/:id', requireAdmin, upload.single('image'), (req, res) => {
  const { name, price, category, video, description, tags, stock, sizes } = req.body;
  const image = req.file ? '/uploads/' + req.file.filename : req.body.image;
  const tagsArray = tags ? tags.split(',').map(t => t.trim()) : [];
  const sizesArray = sizes ? sizes.split(',').map(s => s.trim()) : [];

  Product.update(req.params.id, { name, price: parseInt(price), category, image, video, description, tags: tagsArray, stock: parseInt(stock), sizes: sizesArray }, (err) => {
    if (err) return res.status(500).send('Database error');
    res.redirect('/admin?success=Product updated successfully');
  });
});

// Delete product
router.delete('/products/:id', requireAdmin, (req, res) => {
  Product.delete(req.params.id, (err) => {
    if (err) return res.status(500).send('Database error');
    res.redirect('/admin?success=Product deleted successfully');
  });
});

// Manage categories
router.get('/categories', requireAdmin, (req, res) => {
  Product.getCategories((err, categories) => {
    if (err) return res.status(500).send('Database error');
    res.render('admin/categories', { 
      categories, 
      user: { id: req.session.userId, role: req.session.role },
      success: req.query.success || null
    });
  });
});

router.post('/categories', requireAdmin, (req, res) => {
  const { name } = req.body;
  Product.addCategory(name, (err) => {
    if (err) return res.status(500).send('Database error');
    res.redirect('/admin/categories?success=Category added successfully');
  });
});

router.delete('/categories/:name', requireAdmin, (req, res) => {
  Product.removeCategory(req.params.name, (err) => {
    if (err) return res.status(500).send('Database error');
    res.redirect('/admin/categories?success=Category deleted successfully');
  });
});

// Manage sizes
router.get('/sizes', requireAdmin, (req, res) => {
  Product.getSizes((err, sizes) => {
    if (err) return res.status(500).send('Database error');
    res.render('admin/sizes', { 
      sizes, 
      user: { id: req.session.userId, role: req.session.role },
      success: req.query.success || null
    });
  });
});

router.post('/sizes', requireAdmin, (req, res) => {
  const { name } = req.body;
  Product.addSize(name, (err) => {
    if (err) return res.status(500).send('Database error');
    res.redirect('/admin/sizes?success=Size added successfully');
  });
});

router.delete('/sizes/:name', requireAdmin, (req, res) => {
  Product.removeSize(req.params.name, (err) => {
    if (err) return res.status(500).send('Database error');
    res.redirect('/admin/sizes?success=Size deleted successfully');
  });
});

// Contact info
router.get('/contact', requireAdmin, (req, res) => {
  db.get('SELECT * FROM contact_info LIMIT 1', (err, contact) => {
    if (err) return res.status(500).send('Database error');
    const successMessage = req.query.success || null;
    res.render('admin/contact', { 
      contact: contact || {},
      user: { id: req.session.userId || null, role: req.session.role || null },
      success: successMessage
    });
  });
});

router.post('/contact', requireAdmin, (req, res) => {
  const { address, phone, email } = req.body;
  // First check if contact info exists
  db.get('SELECT id FROM contact_info LIMIT 1', (err, row) => {
    if (err) return res.status(500).send('Database error');
    if (row) {
      // Update existing
      db.run('UPDATE contact_info SET address = ?, phone = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [address, phone, email, row.id], (err) => {
        if (err) return res.status(500).send('Database error');
        res.redirect('/admin/contact?success=Contact information updated successfully');
      });
    } else {
      // Insert new
      db.run('INSERT INTO contact_info (address, phone, email) VALUES (?, ?, ?)', [address, phone, email], (err) => {
        if (err) return res.status(500).send('Database error');
        res.redirect('/admin/contact?success=Contact information updated successfully');
      });
    }
  });
});

module.exports = router;