const db = require('./database');

class Product {
  static create(productData, callback) {
    const { id, name, price, category, image, video, description, tags, stock = 0, sizes } = productData;
    const tagsStr = tags ? tags.join(',') : '';
    const sizesStr = sizes ? sizes.join(',') : '';
    db.run(
      'INSERT INTO products (id, name, price, category, image, video, description, tags, stock, sizes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, price, category, image, video, description, tagsStr, stock, sizesStr],
      callback
    );
  }

  static findAll(callback) {
    db.all('SELECT * FROM products', (err, rows) => {
      if (err) return callback(err);
      const products = rows.map(row => ({
        ...row,
        tags: row.tags ? row.tags.split(',') : [],
        sizes: row.sizes ? row.sizes.split(',') : []
      }));
      callback(null, products);
    });
  }

  static findById(id, callback) {
    db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
      if (err) return callback(err);
      if (row) {
        row.tags = row.tags ? row.tags.split(',') : [];
        row.sizes = row.sizes ? row.sizes.split(',') : [];
      }
      callback(null, row);
    });
  }

  static findByCategory(category, callback) {
    db.all('SELECT * FROM products WHERE category = ?', [category], (err, rows) => {
      if (err) return callback(err);
      const products = rows.map(row => ({
        ...row,
        tags: row.tags ? row.tags.split(',') : [],
        sizes: row.sizes ? row.sizes.split(',') : []
      }));
      callback(null, products);
    });
  }

  static update(id, productData, callback) {
    const { name, price, category, image, video, description, tags, stock, sizes } = productData;
    const tagsStr = tags ? tags.join(',') : '';
    const sizesStr = sizes ? sizes.join(',') : '';
    db.run(
      'UPDATE products SET name = ?, price = ?, category = ?, image = ?, video = ?, description = ?, tags = ?, stock = ?, sizes = ? WHERE id = ?',
      [name, price, category, image, video, description, tagsStr, stock, sizesStr, id],
      callback
    );
  }

  static delete(id, callback) {
    db.run('DELETE FROM products WHERE id = ?', [id], callback);
  }

  static getCategories(callback) {
    db.all('SELECT name FROM categories', callback);
  }

  static addCategory(name, callback) {
    db.run('INSERT INTO categories (name) VALUES (?)', [name], callback);
  }

  static removeCategory(name, callback) {
    db.run('DELETE FROM categories WHERE name = ?', [name], callback);
  }

  static getSizes(callback) {
    db.all('SELECT name FROM sizes', callback);
  }

  static addSize(name, callback) {
    db.run('INSERT INTO sizes (name) VALUES (?)', [name], callback);
  }

  static removeSize(name, callback) {
    db.run('DELETE FROM sizes WHERE name = ?', [name], callback);
  }
}

module.exports = Product;