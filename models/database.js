const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'vexon.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'customer',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Products table
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    category TEXT NOT NULL,
    image TEXT,
    video TEXT,
    description TEXT,
    tags TEXT,
    stock INTEGER DEFAULT 0,
    sizes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Categories table
  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
  )`);

  // Sizes table
  db.run(`CREATE TABLE IF NOT EXISTS sizes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
  )`);

  // Contact info
  db.run(`CREATE TABLE IF NOT EXISTS contact_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    address TEXT,
    phone TEXT,
    email TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

module.exports = db;