const products = [
  {
    id: 'hoodie-black', name: 'Oversized Black Hoodie', price: 35000, category:'men', image:'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80', video:'https://cdn.coverr.co/videos/coverr-street-fashion-5903/720p.mp4', description:'Premium oversized black hoodie with reinforced stitching and modern silhouette.', tags:['hoodies']
  },
  {
    id: 'urban-graphic', name: 'Urban Graphic T-Shirt', price: 20000, category:'men', image:'https://images.unsplash.com/photo-1593032457869-75109efb44d4?auto=format&fit=crop&w=800&q=80', video:'https://cdn.coverr.co/videos/coverr-street-fashion-5837/720p.mp4', description:'Soft cotton graphic tee. A streetwear essential with bold print.', tags:['t-shirts']
  },
  {
    id: 'slim-jeans', name: 'Slim Denim Jeans', price: 40000, category:'men', image:'https://images.unsplash.com/photo-1572560603300-57246b47fc8e?auto=format&fit=crop&w=800&q=80', video:'https://cdn.coverr.co/videos/coverr-urban-fashion-4041/720p.mp4', description:'Comfortable slim denim jeans with stretch for active movement.', tags:['jeans']
  },
  {
    id: 'cargo-pants', name: 'Street Cargo Pants', price: 38000, category:'men', image:'https://images.unsplash.com/photo-1589318238176-3ec0cf50b3f4?auto=format&fit=crop&w=800&q=80', video:'https://cdn.coverr.co/videos/coverr-urban-male-5909/720p.mp4', description:'Relaxed-fit cargo pants with smart pockets for everyday urban efficiency.', tags:['cargo pants']
  },
  {
    id: 'minimalist-hoodie', name: 'Minimalist Hoodie', price: 30000, category:'women', image:'https://images.unsplash.com/photo-1532250488063-8847f678c4c4?auto=format&fit=crop&w=800&q=80', video:'https://cdn.coverr.co/videos/coverr-fashion-model-6279/720p.mp4', description:'Sleek minimalist hoodie in charcoal for modern layered styling.', tags:['hoodies']
  },
  {
    id: 'street-jacket', name: 'Classic Street Jacket', price: 55000, category:'women', image:'https://images.unsplash.com/photo-1555529771-6f4d4d3db9ed?auto=format&fit=crop&w=800&q=80', video:'https://cdn.coverr.co/videos/coverr-urban-2372/720p.mp4', description:'City-ready street jacket in high-quality material with heritage vibe.', tags:['jackets']
  }
];

const state = {
  cart: JSON.parse(localStorage.getItem('vexon-cart') || '[]'),
  wishlist: JSON.parse(localStorage.getItem('vexon-wishlist') || '[]'),
  filter: 'all',
  search: ''
};

const productGrid = document.getElementById('productGrid');
const cartCount = document.getElementById('cartCount');
const cartPanel = document.getElementById('cartPanel');
const wishlistPanel = document.getElementById('wishlistPanel');
const cartItemsEl = document.getElementById('cartItems');
const wishlistItemsEl = document.getElementById('wishlistItems');
const cartTotalEl = document.getElementById('cartTotal');

function formatIQD(value){ return new Intl.NumberFormat('en-US').format(value)+' IQD'; }

function saveState(){ localStorage.setItem('vexon-cart', JSON.stringify(state.cart)); localStorage.setItem('vexon-wishlist', JSON.stringify(state.wishlist)); }

function addToCart(id){
  const item = state.cart.find(i => i.id===id);
  if(item) item.qty += 1; else state.cart.push({ id, qty:1 });
  saveState();
  renderCart();
}

function removeFromCart(id){ state.cart = state.cart.filter(i=>i.id!==id); saveState(); renderCart(); }
function addToWishlist(id){
  if(!state.wishlist.includes(id)) state.wishlist.push(id);
  saveState(); renderWishlist(); renderProducts();
}
function removeFromWishlist(id){ state.wishlist = state.wishlist.filter(i=>i!==id); saveState(); renderWishlist(); renderProducts(); }

function renderProducts(){
  productGrid.innerHTML = '';
  const filtered = products.filter(p => {
    const categoryOk = state.filter==='all' || p.category===state.filter;
    const searchOk = p.name.toLowerCase().includes(state.search.toLowerCase()) || p.description.toLowerCase().includes(state.search.toLowerCase());
    return categoryOk && searchOk;
  });

  for(const product of filtered){
    const card = document.createElement('article');
    card.className = 'product-card';

    card.innerHTML = `
      <a href="product.html?id=${product.id}" class="product-media" title="${product.name}">
        <img src="${product.image}" loading="lazy" alt="${product.name}" />
        <video muted loop playsinline preload="auto"><source src="${product.video}" type="video/mp4"></video>
      </a>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">${formatIQD(product.price)}</p>
        <div class="product-actions">
          <button class="btn btn-primary" data-add-cart="${product.id}">Add to Cart</button>
          <button class="btn wishlist-btn ${state.wishlist.includes(product.id) ? 'active': ''}" data-wishlist="${product.id}" title="Wishlist"><i class="fas fa-heart"></i></button>
        </div>
      </div>
    `;

    card.querySelector('video').addEventListener('mouseenter', function(){ this.play(); });
    card.querySelector('video').addEventListener('mouseleave', function(){ this.pause(); this.currentTime=0; });

    productGrid.appendChild(card);
  }
}

function renderCart(){
  cartCount.textContent = state.cart.reduce((sum,i)=>sum+i.qty,0);
  cartItemsEl.innerHTML = '';
  let total = 0;

  if(state.cart.length===0){ cartItemsEl.textContent = 'Your cart is empty.'; cartTotalEl.textContent='0 IQD'; return; }

  state.cart.forEach(({id,qty})=>{
    const product = products.find(p=>p.id===id);
    if(!product) return;
    const line = product.price * qty;
    total += line;

    const item = document.createElement('div'); item.className = 'cart-item';
    item.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <div class="cart-item-details">
        <h4>${product.name}</h4>
        <p>${formatIQD(product.price)} x ${qty}</p>
        <p>${formatIQD(line)}</p>
        <button class="btn btn-tertiary" data-remove-cart="${id}">Remove</button>
      </div>
    `;
    item.querySelector('[data-remove-cart]').addEventListener('click', ()=>removeFromCart(id));
    cartItemsEl.appendChild(item);
  });
  cartTotalEl.textContent = formatIQD(total);
}

function renderWishlist(){
  wishlistItemsEl.innerHTML='';
  if(state.wishlist.length===0){ wishlistItemsEl.textContent='No wishlist items yet.'; return; }
  state.wishlist.forEach(id=>{
    const product = products.find(p=>p.id===id);
    if(!product) return;
    const item = document.createElement('div'); item.className='wishlist-item';
    item.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <div class="wishlist-item-details">
        <h4>${product.name}</h4>
        <p>${formatIQD(product.price)}</p>
        <button class="btn btn-tertiary" data-remove-wishlist="${id}">Remove</button>
      </div>
    `;
    item.querySelector('[data-remove-wishlist]').addEventListener('click', ()=>removeFromWishlist(id));
    wishlistItemsEl.appendChild(item);
  });
}

function setupEvents(){
  document.querySelectorAll('[data-filter]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      state.filter=btn.dataset.filter;
      renderProducts();
    });
  });

  document.getElementById('productSearch').addEventListener('input', e=>{
    state.search = e.target.value;
    renderProducts();
  });

  document.getElementById('productGrid').addEventListener('click', e=>{
    const add = e.target.closest('[data-add-cart]');
    if(add){ addToCart(add.dataset.addCart); renderCart(); }
    const wish = e.target.closest('[data-wishlist]');
    if(wish){
      const id = wish.dataset.wishlist;
      if(state.wishlist.includes(id)) removeFromWishlist(id); else addToWishlist(id);
    }
  });

  document.getElementById('cartToggle').addEventListener('click', ()=>{
    cartPanel.classList.toggle('hidden'); setTimeout(()=>wishlistPanel.classList.add('hidden'),0);
  });
  document.getElementById('wishlistToggle').addEventListener('click', ()=>{
    wishlistPanel.classList.toggle('hidden'); setTimeout(()=>cartPanel.classList.add('hidden'),0);
  });
  document.getElementById('closeCart').addEventListener('click', ()=>cartPanel.classList.add('hidden'));
  document.getElementById('closeWishlist').addEventListener('click', ()=>wishlistPanel.classList.add('hidden'));
  document.getElementById('checkoutBtn').addEventListener('click', ()=>alert('Cash on Delivery checkout initiated. Our team will contact you within 24h.'));

  renderCart();
  renderWishlist();

  initializeCircleGallery();
}

function initializeCircleGallery() {
  const frame = document.getElementById('circleFrame');
  if(!frame) return;
  const items = Array.from(frame.querySelectorAll('.circle-item'));
  const total = items.length;
  const radius = 255;

  items.forEach((item, idx) => {
    const angle = (idx / total) * 360;
    item.dataset.baseAngle = angle;

    item.addEventListener('click', (event) => {
      if(item.dataset.category === 'men' || item.dataset.category === 'women' || item.dataset.category === 'kids') {
        event.preventDefault();
        document.getElementById(`category-${item.dataset.category}`)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        state.filter = 'all';
        state.search = item.dataset.category;
        document.getElementById('productSearch').value = item.dataset.category;
        renderProducts();
      }
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });

    item.addEventListener('mouseenter', () => item.classList.add('active'));
    item.addEventListener('mouseleave', () => item.classList.remove('active'));
  });

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    direction: 'vertical'
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  gsap.registerPlugin(ScrollTrigger);

  gsap.to(frame, {
    rotation: 360,
    ease: 'none',
    scrollTrigger: {
      trigger: '#circleSection',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      pin: true,
      onUpdate: (self) => {
        const rotation = self.progress * 360;
        items.forEach(item => {
          const baseAngle = Number(item.dataset.baseAngle);
          const angle = baseAngle + rotation;
          item.style.transform = `rotate(${angle}deg) translate(0, -${radius}px) rotate(${-angle}deg)`;
        });
      }
    }
  });

  ScrollTrigger.addEventListener('refresh', () => lenis.update());
}

renderProducts();
setupEvents();
