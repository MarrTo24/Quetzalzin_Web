const WHATSAPP = '525523278809';
const money = n => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n);
const assetUrl = name => 'assets/' + encodeURIComponent(name);

const services = [
  { name: 'Masaje relajante', price: 600, desc: 'Sesión enfocada en descanso y bienestar.', img: 'assets/masaje_relajante.jpg' },
  { name: 'Masaje descontracturante', price: 700, desc: 'Sesión para aliviar tensión muscular.', img: 'assets/masaje_descontracturante.jpg' },
  { name: 'Masaje con ventosas', price: 650, desc: 'Sesión de masaje con terapia de ventosas.', img: 'assets/masaje_ventosas.jpg' },
  { name: 'Drenaje linfático', price: 600, desc: 'Sesión de drenaje linfático.', img: 'assets/drenaje_linfatico.jpg' },
  { name: 'Depilación IPL — zonas pequeñas (8 sesiones)', price: 1500, desc: 'Axilas, contorno bikini o línea interglútea.', img: 'assets/depilacion_zonaspequenas.png' },
  { name: 'Depilación IPL — zonas medianas (8 sesiones)', price: 2500, desc: 'Espalda, brazos, glúteos o bikini completo.', img: 'assets/depilacion_zonasmedianas.png' },
  { name: 'Depilación IPL — zonas grandes (8 sesiones)', price: 8500, desc: 'Piernas completas o cuerpo completo. Precio/zonas sujetos a confirmación.', img: 'assets/depilacion_zonasgrandes.png' },
  { name: 'Facial', price: 400, desc: 'Incluye hidrafacial, radiofrecuencia y ultrasonido según promoción. Indica 5 sesiones de bigote de regalo.', img: 'assets/facial.jpg' },
  { name: 'Sauna — sesiones', price: 1800, desc: 'Promoción publicada por Eve Spa. Número de sesiones pendiente de confirmar.', img: 'assets/sauna.jpg' }
];

const productImages = [
  'balsamo_magico.jpg', 'gel_magico.jpg', 'serum_facial.jpg', 'shampoo.jpg', 'jabon.jpg',
  'jabon.jpg', 'sal_exfoliante.jpg', 'crema_corporal.jpg', 'crema_varices.jpg', 'gel_reductivo.jpg',
  'lashes_trat.jpg', 'rectangular.jpg', 'bola_estambre.jpg', 'arcoiris.jpg', 'burbuja.jpg',
  'hermanas.jpg', 'pino_chico.jpg', 'pino_grande.jpg', 'plato_chico.jpg',
  'plato_grande.jpg', 'plato_chico_vela_pequeña.jpg', 'plato_grande_vela_pequeña.jpg',
  'plato_grande_2_velas.jpg', 'plato_grande_difusor.jpg', 'plato_grande_portavelas.jpg',
  'balsamo_arnica.jpg', 'balsamo_tomillo.jpg'
];

const products = [
  ['Bálsamo Mágico', 'Cosmética', 215, '120 ml', 'Extractos botánicos.'],
  ['Gel Mágico', 'Cosmética', 120, '130 ml', 'Gel de uso corporal.'],
  ['Sérum Facial', 'Cosmética', 150, '50 ml', 'Sérum facial.'],
  ['Shampoo Hidratante', 'Cabello', null, null, 'Presentaciones disponibles.', ['250 ml', 150], ['490 ml', 280]],
  ['Jabón Artesanal Natural', 'Corporal', 30, null, 'Barra artesanal de miel, avena y caléndula.'],
  ['Jabón Artesanal Planta', 'Corporal', 40, null, 'Barra artesanal con romero y extractos botánicos.'],
  ['Sal Exfoliante', 'Corporal', 60, '90 g', 'Sal marina y aceites esenciales.'],
  ['Crema Corporal', 'Corporal', null, null, 'Presentaciones disponibles.', ['250 ml', 140], ['490 ml', 170]],
  ['Crema Varices', 'Corporal', 180, '250 ml', 'Crema corporal.'],
  ['Gel Reductivo', 'Corporal', 140, '250 ml', 'Gel corporal.'],
  ['Lashes Tratamiento', 'Cosmética', 80, '6 ml', 'Tratamiento para pestañas.'],
  ['Vela Rectangular', 'Velas', 90, null, 'Vela de cera de soya + plato chico.'],
  ['Vela Bola de Estambre', 'Velas', 80, null, 'Vela de cera de soya + plato chico.'],
  ['Vela Arcoíris', 'Velas', 140, null, 'Vela decorativa + plato grande.'],
  ['Vela Burbuja', 'Velas', 100, null, 'Vela decorativa + plato chico.'],
  ['Velas Hermanas', 'Velas', 210, null, 'Set de velas + plato grande.'],
  ['Vela Pino Chico', 'Velas', 130, null, 'Vela decorativa + plato chico.'],
  ['Vela Pino Grande', 'Velas', 160, null, 'Vela decorativa + plato grande.'],
  ['Plato Chico', 'Accesorios', 50, null, 'Pieza de cemento.'],
  ['Plato Grande', 'Accesorios', 80, null, 'Pieza de cemento.'],
  ['Set: Plato Chico + Vela', 'Accesorios', 100, null, 'Set decorativo.'],
  ['Set: Plato Grande + 1 vela', 'Accesorios', 110, null, 'Set decorativo.'],
  ['Set: Plato Grande + 2 velas', 'Accesorios', 150, null, 'Set decorativo.'],
  ['Set: Plato + Portavelas Difusor', 'Accesorios', 180, null, 'Set decorativo.'],
  ['Set: Plato + Portavelas Cilindro', 'Accesorios', 200, null, 'Set decorativo.'],
  ['Bálsamo de Árnica', 'Corporal', 180, '125 ml', 'Bálsamo corporal de árnica.'],
  ['Bálsamo de Tomillo', 'Corporal', 180, '125 ml', 'Bálsamo corporal de tomillo.']
].map((p, i) => ({ id: 'p' + i, name: p[0], category: p[1], price: p[2], size: p[3], desc: p[4], variants: p.slice(5), image: productImages[i] }));

const productDescriptions = {
  'Bálsamo Mágico': 'Elaborado con extractos de cannabis, romero, eucalipto, ortiga y albahaca. Su textura facilita el masaje y deja la piel suave.',
  'Gel Mágico': 'Fórmula ligera con extractos de cannabis, ruda y árnica. Se absorbe rápido y deja una sensación refrescante.',
  'Sérum Facial': 'Con colágeno, aloe vera y vitamina E. Su textura ligera ayuda a mantener la piel suave, luminosa y fresca.',
  'Shampoo Hidratante': 'Formulado con romero y ortiga; limpia delicadamente y ayuda a mantener el cabello hidratado, suave y saludable.',
  'Jabón Artesanal Natural': 'Elaborado artesanalmente con ingredientes naturales como miel, avena y caléndula; deja la piel limpia, suave y perfumada.',
  'Jabón Artesanal Planta': 'Elaborado artesanalmente con ingredientes naturales como romero, miel, avena y caléndula; deja la piel limpia, suave y perfumada.',
  'Sal Exfoliante': 'La sal marina y los aceites esenciales eliminan suavemente impurezas y células muertas, dejando la piel suave y renovada.',
  'Crema Corporal': 'Con aloe vera y agentes humectantes que ayudan a mantener la hidratación natural de la piel; su textura es ligera y fresca.',
  'Crema Varices': 'Con extractos de ajo, árnica, ginkgo biloba y cannabis, brinda una sensación de frescura y confort para complementar el masaje diario.',
  'Gel Reductivo': 'Elaborado con ginkgo biloba, árnica y menta; proporciona una sensación refrescante y facilita el masaje por su rápida absorción.',
  'Lashes Tratamiento': 'Mezcla de esencia de romero, vitamina E y aceites esenciales que nutre y acondiciona las pestañas.',
  'Bálsamo de Árnica': 'Elaborado con extracto de árnica. Ideal para aplicar mediante un suave masaje después del ejercicio o de las actividades diarias.',
  'Bálsamo de Tomillo': 'Formulado con extracto de tomillo e ingredientes naturales; su aroma herbal brinda confort al aplicarlo en pecho, espalda y cuello.',
  'Vela Rectangular': 'Diseño minimalista para decorar mesas, repisas o centros de mesa. Medidas: 5.7 × 5.7 cm de base × 8.7 cm de alto.',
  'Vela Bola de Estambre': 'Vela artesanal con diseño en forma de estambre que añade un toque moderno y acogedor. Medidas: 5.7 × 5 cm.',
  'Vela Arcoíris': 'Vela decorativa con diseño contemporáneo que aporta color y estilo. Medidas: 8.1 cm de ancho × 14.1 cm de alto.',
  'Vela Burbuja': 'Diseño de burbujas moderno y elegante para complementar cualquier decoración. Medidas: 5.5 × 5.5 cm.',
  'Velas Hermanas': 'Juego de dos velas cilíndricas de distintos tamaños. Incluye vela chica de 4.8 cm de diámetro × 7.8 cm de alto y vela grande de 5.5 cm × 12.3 cm de alto.',
  'Vela Pino Chico': 'Vela artesanal inspirada en un pino, ideal para decorar con un toque cálido y elegante. Medidas: 7 cm de ancho × 9.2 cm de alto.',
  'Vela Pino Grande': 'Pieza decorativa artesanal que aporta calidez y armonía. Medidas: 7.4 cm de ancho × 12.5 cm de alto.',
  'Plato Chico': 'Plato artesanal de concreto, elegante y resistente para velas, difusores o decoración. Medidas: 18.5 × 10 cm.',
  'Plato Grande': 'Plato de concreto fabricado artesanalmente para complementar velas, portavelas o arreglos decorativos. Medidas: 24 × 12 cm.',
  'Set: Plato Chico + Vela': 'Set artesanal con vela decorativa y plato de concreto, ideal para centros de mesa, decoración o regalos. Incluye vela de 6.3 cm de diámetro y plato de 18.5 × 10 cm.',
  'Set: Plato Grande + 1 vela': 'Combinación elegante de una vela decorativa y un plato de concreto de 24 × 12 cm para aportar armonía y estilo.',
  'Set: Plato Grande + 2 velas': 'Set decorativo con dos velas y un plato de concreto de 24 × 12 cm, pensado para realzar cualquier ambiente.',
  'Set: Plato + Portavelas Difusor': 'Set artesanal con plato decorativo y portavelas tipo difusor, ideal para crear espacios acogedores.',
  'Set: Plato + Portavelas Cilindro': 'Set con plato artesanal y portavelas cilíndrico de diseño moderno y minimalista para decorar con estilo.'
};
products.forEach(product => { if (productDescriptions[product.name]) product.desc = productDescriptions[product.name]; });

const categoryOrder = ['Cosmética', 'Cabello', 'Corporal', 'Velas', 'Accesorios'];
const categoryLabels = {
  'Cosmética': 'Cuidado facial y diario',
  'Cabello': 'Rutina capilar',
  'Corporal': 'Cuidado corporal',
  'Velas': 'Aromas para tu espacio',
  'Accesorios': 'Piezas y sets artesanales'
};

let cart = [];
try {
  cart = JSON.parse(localStorage.getItem('eve-quetzalzin-quote') || '[]');
} catch {
  cart = [];
}
let lastCartCount = cart.reduce((n, item) => n + item.qty, 0);

function add(item) {
  const key = item.name + '|' + (item.variant || '');
  const found = cart.find(x => x.key === key);
  if (found) found.qty++;
  else cart.push({ ...item, key, qty: 1 });
  save();
}
function addService(name, price) { add({ name, price, kind: 'Servicio', variant: '' }); }
function addFacialPromotion() {
  const facialPromotion = services.find(service => service.name === 'Facial');
  if (!facialPromotion) return;
  addService(facialPromotion.name, facialPromotion.price);
  if (!document.getElementById('drawer').classList.contains('open')) toggleCart();
}
function save() {
  try {
    localStorage.setItem('eve-quetzalzin-quote', JSON.stringify(cart));
  } catch {
    // localStorage puede fallar en modo privado o con cuota llena; la sesión sigue funcionando en memoria.
  }
  renderCart();
}

function renderServices() {
  document.querySelector('#services').innerHTML = services.map(s =>
    `<article class="service"><img src="${s.img}" alt="${s.name}" loading="lazy"><h3>${s.name}</h3><p>${s.desc}</p><div class="price">${money(s.price)}</div><button class="add" data-action="add-service" data-name="${s.name}" data-price="${s.price}">Agregar a cotización</button></article>`
  ).join('');
}

function renderProducts() {
  const productsEl = document.getElementById('products');
  productsEl.innerHTML = categoryOrder.map(categoryName => {
    const items = products.filter(product => product.category === categoryName);
    if (!items.length) return '';
    const cards = items.map(product => {
      const options = product.variants.length
        ? product.variants.map(variant => `<option value="${variant[1]}">${variant[0]} · ${money(variant[1])}</option>`).join('')
        : '';
      const price = product.price ?? product.variants[0][1];
      return `<article class="product"><img class="product-image" src="${assetUrl(product.image)}" alt="${product.name}" loading="lazy"><div class="product-body"><span class="category">${product.category}</span><h3>${product.name}</h3><p>${product.desc}${product.size ? ' · ' + product.size : ''}</p>${options ? `<label class="sr-only" for="v-${product.id}">Presentación de ${product.name}</label><select id="v-${product.id}">${options}</select>` : ''}<div class="bottom"><span class="price">${money(price)}</span><button class="add" data-action="add-product" data-id="${product.id}">Agregar</button></div></div></article>`;
    }).join('');
    return `<section class="catalog-group" aria-labelledby="group-${categoryName}"><div class="catalog-group-heading"><h3 id="group-${categoryName}">${categoryName}</h3><span>${categoryLabels[categoryName]}</span></div><div class="catalog-group-grid">${cards}</div></section>`;
  }).join('');
}

function addProduct(id) {
  const p = products.find(x => x.id === id);
  const v = p.variants.length ? document.getElementById('v-' + id) : null;
  const label = v ? v.options[v.selectedIndex].text.split(' · ')[0] : p.size || '';
  const price = v ? +v.value : p.price;
  add({ name: p.name, price, variant: label, kind: 'Producto' });
}

function renderCart() {
  const itemCount = cart.reduce((n, x) => n + x.qty, 0);
  document.getElementById('count').textContent = itemCount;
  document.getElementById('floatingCount').textContent = itemCount;
  document.getElementById('total').textContent = money(cart.reduce((n, x) => n + x.qty * x.price, 0));
  const cartItems = document.getElementById('cartItems');
  cartItems.innerHTML = cart.length
    ? cart.map((x, i) => `<div class="cart-item"><strong>${x.name}</strong><small>${x.kind}${x.variant ? ' · ' + x.variant : ''}</small><div class="cart-row"><span>${money(x.price)} × ${x.qty}</span><span class="qty"><button data-action="qty-dec" data-index="${i}" aria-label="Quitar una unidad de ${x.name}">−</button> ${x.qty} <button data-action="qty-inc" data-index="${i}" aria-label="Agregar una unidad de ${x.name}">+</button></span></div></div>`).join('')
    : '<p class="empty">Aún no agregas servicios ni productos.</p>';
  const floatingCart = document.getElementById('floatingCart');
  if (itemCount !== lastCartCount) {
    floatingCart.classList.remove('bump');
    void floatingCart.offsetWidth;
    floatingCart.classList.add('bump');
    lastCartCount = itemCount;
  }
}

function qty(i, n) {
  cart[i].qty += n;
  if (cart[i].qty < 1) cart.splice(i, 1);
  save();
}

function toggleCart() {
  const isOpen = document.getElementById('drawer').classList.toggle('open');
  document.querySelector('.cart-button').setAttribute('aria-expanded', String(isOpen));
}

function openEveWhatsApp() {
  const win = window.open('https://wa.me/' + WHATSAPP, '_blank');
  if (!win) alert('Tu navegador bloqueó la ventana de WhatsApp. Permite las ventanas emergentes para este sitio e inténtalo de nuevo.');
}

function sendQuote() {
  if (!cart.length) return alert('Agrega al menos un producto o servicio.');
  const lines = cart.map(x => `• ${x.kind}: ${x.name}${x.variant ? ' (' + x.variant + ')' : ''} ×${x.qty} = ${money(x.qty * x.price)}`).join('\n');
  const msg = `Hola, deseo cotizar lo siguiente:\n\n${lines}\n\nTotal estimado: ${money(cart.reduce((n, x) => n + x.qty * x.price, 0))}\n\n¿Me confirman disponibilidad?`;
  const win = window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg), '_blank');
  if (!win) alert('Tu navegador bloqueó la ventana de WhatsApp. Permite las ventanas emergentes para este sitio e inténtalo de nuevo.');
}

document.getElementById('services').addEventListener('click', event => {
  const btn = event.target.closest('[data-action="add-service"]');
  if (btn) addService(btn.dataset.name, +btn.dataset.price);
});
document.getElementById('products').addEventListener('click', event => {
  const btn = event.target.closest('[data-action="add-product"]');
  if (btn) addProduct(btn.dataset.id);
});
document.getElementById('cartItems').addEventListener('click', event => {
  const btn = event.target.closest('[data-action]');
  if (!btn) return;
  const i = +btn.dataset.index;
  if (btn.dataset.action === 'qty-dec') qty(i, -1);
  if (btn.dataset.action === 'qty-inc') qty(i, 1);
});
document.querySelector('.cart-button').addEventListener('click', toggleCart);
document.getElementById('floatingCart').addEventListener('click', toggleCart);
document.getElementById('drawerCloseButton').addEventListener('click', toggleCart);
document.getElementById('sendQuoteButton').addEventListener('click', sendQuote);
document.getElementById('waFloatButton').addEventListener('click', openEveWhatsApp);
document.getElementById('heroPromoAction').addEventListener('click', addFacialPromotion);
document.getElementById('duoreQuoteButton').addEventListener('click', () => addService('Duore Body — sesión individual (45 min)', 400));

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && document.getElementById('drawer').classList.contains('open')) toggleCart();
});

const facialPromotion = services.find(service => service.name === 'Facial');
if (facialPromotion) document.getElementById('heroPromoAction').textContent = `Agregar Facial · ${money(facialPromotion.price)}`;

renderServices();
renderProducts();
renderCart();
