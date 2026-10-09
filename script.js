/* ======================================================
   PRODUCTOS
   Precios únicos (sin descuentos por cantidad):
   - Marcapáginas con imán: $1300
   - Imanes: $250
   - Stickers: $150
====================================================== */
const PRICES = {
  marcapaginas: 1300,
  imanes: 250,
  stickers: 150
};

const products = [];

// Íconos decorativos que se muestran si la imagen no carga
const art = {
  marcapaginas: ['☾', '✿', '☀'],
  imanes: ['♡', '⌂', '❀'],
  stickers: ['▤', '✦', '“”']
};

// Marcapáginas (16)
for (let n = 1; n <= 16; n++) {
  products.push({
    id: n,
    name: `Marcapáginas con imán ${String(n).padStart(2, '0')}`,
    category: 'marcapaginas',
    categoryLabel: 'Marcapáginas con imán',
    price: PRICES.marcapaginas,
    image: `assets/marcapaginas_imagenes/marcapagina_imagen_${n}.jpeg`,
    description: 'Marcapáginas con imán hecho a mano para acompañar tus lecturas.'
  });
}

// Imanes (22)
for (let n = 1; n <= 22; n++) {
  products.push({
    id: 100 + n,
    name: `Imán ilustrado ${String(n).padStart(2, '0')}`,
    category: 'imanes',
    categoryLabel: 'Imanes',
    price: PRICES.imanes,
    image: `assets/imanes_imagenes/iman_imagen_${n}.png`,
    description: 'Imán ilustrado hecho a mano. Tiene hasta 5 cm de altura.'
  });
}

// Stickers (18)
for (let n = 1; n <= 18; n++) {
  products.push({
    id: 200 + n,
    name: `Sticker ilustrado ${String(n).padStart(2, '0')}`,
    category: 'stickers',
    categoryLabel: 'Stickers',
    price: PRICES.stickers,
    image: `assets/sticker_imagenes/sticker_imagen_${n}.png`,
    description: 'Sticker ilustrado para decorar tus objetos favoritos.'
  });
}

/* ======================================================
   ESTADO Y ELEMENTOS
====================================================== */
const state = {
  filter: 'all',
  selected: null,
  cart: []
};

const money = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0
});

const grid = document.querySelector('[data-products]');
const modal = document.querySelector('[data-modal]');
const cart = document.querySelector('[data-cart]');

/* ======================================================
   PRODUCTOS
====================================================== */
function productArt(p) {
  const icon = art[p.category][(p.id % 100 - 1) % 3];

  return `
    <div class="art">
      <img src="${p.image}" alt="" onerror="this.remove()">
      <span>${icon}</span>
      <small>Último Capítulo<br>Eich</small>
    </div>`;
}

function renderProducts() {
  const visible = products.filter(
    p => state.filter === 'all' || p.category === state.filter
  );

  grid.innerHTML = visible.map(p => `
    <article class="product">
      <button data-view="${p.id}" aria-label="Ver ${p.name}">
        ${productArt(p)}
      </button>
      <div class="product-info">
        <p>${p.categoryLabel}</p>
        <div>
          <h3>${p.name}</h3>
          <strong>${money.format(p.price)} c/u</strong>
        </div>
      </div>
    </article>`).join('');

  document.querySelector('[data-count]').textContent =
    `${visible.length} detalles para descubrir`;

  // La nota de los imanes solo se ve en "Todos" e "Imanes"
  document.querySelector('[data-magnet-note]').hidden =
    !['all', 'imanes'].includes(state.filter);
}

/* ======================================================
   MODAL DE PRODUCTO
====================================================== */
function openProduct(id) {
  const p = products.find(x => x.id === +id);
  state.selected = p;

  document.querySelector('[data-modal-art]').innerHTML = productArt(p);
  document.querySelector('[data-modal-category]').textContent = p.categoryLabel;
  document.querySelector('[data-modal-title]').textContent = p.name;
  document.querySelector('[data-modal-description]').textContent = p.description;
  document.querySelector('[data-modal-price]').textContent = `${money.format(p.price)} c/u`;

  modal.classList.add('show');
}

function closeModal() {
  modal.classList.remove('show');
}

/* ======================================================
   CARRITO
====================================================== */
function pricing() {
  const subtotal = state.cart.reduce((acc, p) => acc + p.price * p.quantity, 0);
  return { subtotal, total: subtotal };
}

function renderCart() {
  const quantity = state.cart.reduce((acc, p) => acc + p.quantity, 0);
  const cost = pricing();

  document.querySelector('.cart-count').textContent = quantity;
  document.querySelector('[data-subtotal]').textContent = money.format(cost.subtotal);
  document.querySelector('[data-total]').textContent = money.format(cost.total);
  document.querySelector('[data-empty]').hidden = !!quantity;

  document.querySelector('[data-cart-items]').innerHTML = state.cart.map(p => `
    <div class="cart-item">
      <div>
        <strong>${p.name}</strong>
        <span>${money.format(p.price)} c/u</span>
      </div>
      <div class="quantity">
        <button data-qty="${p.id}" data-d="-1">−</button>
        <b>${p.quantity}</b>
        <button data-qty="${p.id}" data-d="1">+</button>
      </div>
    </div>`).join('');
}

function openCart() {
  cart.classList.add('open');
}

function closeCart() {
  cart.classList.remove('open');
}

/* ======================================================
   EVENTOS
====================================================== */

// Filtros
document.querySelectorAll('[data-filter]').forEach(b => {
  b.onclick = () => {
    state.filter = b.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(x =>
      x.classList.toggle('active', x === b)
    );
    renderProducts();
  };
});

// Abrir producto
grid.onclick = e => {
  const b = e.target.closest('[data-view]');
  if (b) openProduct(b.dataset.view);
};

// Cerrar modal
document.querySelectorAll('[data-close-modal]').forEach(b => {
  b.onclick = closeModal;
});

// Agregar al carrito
document.querySelector('[data-add]').onclick = () => {
  const item = state.cart.find(p => p.id === state.selected.id);

  if (item) {
    item.quantity++;
  } else {
    state.cart.push({ ...state.selected, quantity: 1 });
  }

  renderCart();
  closeModal();
  openCart();
};

// Abrir / cerrar carrito
document.querySelector('[data-open-cart]').onclick = openCart;
document.querySelectorAll('[data-close-cart]').forEach(b => {
  b.onclick = closeCart;
});

// Sumar / restar cantidades
document.querySelector('[data-cart-items]').onclick = e => {
  const b = e.target.closest('[data-qty]');
  if (!b) return;

  const p = state.cart.find(x => x.id === +b.dataset.qty);
  p.quantity += +b.dataset.d;

  if (!p.quantity) {
    state.cart = state.cart.filter(x => x !== p);
  }

  renderCart();
};

// Enviar pedido por WhatsApp
document.querySelector('[data-whatsapp]').onclick = () => {
  if (!state.cart.length) return;

  const list = state.cart
    .map(p => `• ${p.name} x${p.quantity}`)
    .join('\n');
  const cost = pricing();

  const message =
    `¡Hola! Me gustaría consultar por estos productos de Último Capítulo Eich:\n\n` +
    `${list}\n\n` +
    `Total estimado: ${money.format(cost.total)}`;

  window.open(
    `https://wa.me/5493794136245?text=${encodeURIComponent(message)}`,
    '_blank',
    'noopener'
  );
};

/* ======================================================
   INICIO
====================================================== */
renderProducts();
renderCart();