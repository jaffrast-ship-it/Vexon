const express = require('express');
const session = require('express-session');
const path = require('path');
const methodOverride = require('method-override');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(session({
  secret: 'vexon-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const ownerRoutes = require('./routes/owner');

app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/owner', ownerRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`VEXON server running on port ${PORT}`);
});