const Product = require('./models/Product');
const db = require('./models/database');

const products = [
  {
    id: 'hoodie-black', name: 'Oversized Black Hoodie', price: 35000, category:'men', image:'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80', video:'https://cdn.coverr.co/videos/coverr-street-fashion-5903/720p.mp4', description:'Premium oversized black hoodie with reinforced stitching and modern silhouette.', tags:['hoodies'], stock: 10, sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'urban-graphic', name: 'Urban Graphic T-Shirt', price: 20000, category:'men', image:'https://images.unsplash.com/photo-1593032457869-75109efb44d4?auto=format&fit=crop&w=800&q=80', video:'https://cdn.coverr.co/videos/coverr-street-fashion-5837/720p.mp4', description:'Soft cotton graphic tee. A streetwear essential with bold print.', tags:['t-shirts'], stock: 15, sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'slim-jeans', name: 'Slim Denim Jeans', price: 40000, category:'men', image:'https://images.unsplash.com/photo-1572560603300-57246b47fc8e?auto=format&fit=crop&w=800&q=80', video:'https://cdn.coverr.co/videos/coverr-urban-fashion-4041/720p.mp4', description:'Comfortable slim denim jeans with stretch for active movement.', tags:['jeans'], stock: 8, sizes: ['28', '30', '32', '34']
  },
  {
    id: 'cargo-pants', name: 'Street Cargo Pants', price: 38000, category:'men', image:'https://images.unsplash.com/photo-1589318238176-3ec0cf50b3f4?auto=format&fit=crop&w=800&q=80', video:'https://cdn.coverr.co/videos/coverr-urban-male-5909/720p.mp4', description:'Relaxed-fit cargo pants with smart pockets for everyday urban efficiency.', tags:['cargo pants'], stock: 12, sizes: ['28', '30', '32', '34']
  },
  {
    id: 'minimalist-hoodie', name: 'Minimalist Hoodie', price: 30000, category:'women', image:'https://images.unsplash.com/photo-1532250488063-8847f678c4c4?auto=format&fit=crop&w=800&q=80', video:'https://cdn.coverr.co/videos/coverr-fashion-model-6279/720p.mp4', description:'Sleek minimalist hoodie in charcoal for modern layered styling.', tags:['hoodies'], stock: 10, sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: 'street-jacket', name: 'Classic Street Jacket', price: 55000, category:'women', image:'https://images.unsplash.com/photo-1555529771-6f4d4d3db9ed?auto=format&fit=crop&w=800&q=80', video:'https://cdn.coverr.co/videos/coverr-urban-2372/720p.mp4', description:'City-ready street jacket in high-quality material with heritage vibe.', tags:['jackets'], stock: 5, sizes: ['XS', 'S', 'M', 'L']
  }
];

const categories = ['men', 'women', 'kids'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', '28', '30', '32', '34'];

db.serialize(() => {
  // Insert categories
  categories.forEach(cat => {
    db.run('INSERT OR IGNORE INTO categories (name) VALUES (?)', [cat]);
  });

  // Insert sizes
  sizes.forEach(size => {
    db.run('INSERT OR IGNORE INTO sizes (name) VALUES (?)', [size]);
  });

  // Insert products
  products.forEach(product => {
    Product.create(product, (err) => {
      if (err) console.error('Error inserting product:', err);
      else console.log('Inserted product:', product.name);
    });
  });

  // Insert default contact info
  db.run('INSERT OR IGNORE INTO contact_info (address, phone, email) VALUES (?, ?, ?)', 
    ['Baghdad, Iraq', '+964 123 456 789', 'info@vexon.iq']);

  // Create owner user
  const bcrypt = require('bcryptjs');
  const hashedPassword = bcrypt.hashSync('owner123', 10);
  db.run('INSERT OR IGNORE INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
    ['owner', 'owner@vexon.iq', hashedPassword, 'owner']);
});

console.log('Migration completed.');