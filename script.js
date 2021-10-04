// Fonte: https://github.com/tryber/sd-015-b-project-shopping-cart/pull/126/files#
// Fonte: https://developer.mozilla.org/pt-BR/docs/Web/API/fetch
// Fonte: https://attacomsian.com/blog/javascript-convert-nodelist-to-array
// Fonte: https://www.w3schools.com/jsref/jsref_parsefloat.asp
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const olCartItems = '.cart__items';
const saveShoppingCart = () => {
  const cartItems = document.querySelectorAll(olCartItems);
  cartItems.forEach((element) => localStorage.setItem('shoppingCart', JSON
  .stringify(element.innerHTML)));
};

function updateCartTotalPrice() {
  const totalPrice = document.querySelector('.total-price');
  const items = document.querySelectorAll('.cart__item');
  const prices = Array.from(items).map((item) => parseFloat(item.innerText.split('$')
    .pop(), 10)).reduce((acc, curr) => acc + curr, 0);
  totalPrice.innerText = prices.toFixed(2);
}

function cartItemClickListener(event) {
  event.target.remove();
  saveShoppingCart();
  updateCartTotalPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addToCartAPI(searckSku) {
  const sku = getSkuFromProductItem(searckSku);
  const url = `https://api.mercadolibre.com/items/${sku}`;
  fetch(url)
  .then((data) => data.json())
  .then(({ id, title, price }) => {
    const items = document.querySelector(olCartItems);
    items.appendChild(createCartItemElement({ sku: id, name: title, salePrice: price }));
    saveShoppingCart();
    updateCartTotalPrice();
  });
}

const addToCartButton = () => {
  const sections = document.querySelectorAll('.item');
  sections.forEach((section) => section.lastChild
  .addEventListener('click', () => addToCartAPI(section)));
};

async function getInfoAPI(search) {
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${search}`;
  await fetch(url)
  .then((data) => data.json())
  .then(({ results }) => results.forEach(({ id, title, thumbnail }) => {
    const items = document.querySelector('.items');
    items.appendChild(createProductItemElement(
    { sku: id, name: title, image: thumbnail },
    ));
  }));
}

const clearCartButton = () => {
  const cartItemsOl = document.querySelector(olCartItems);
  cartItemsOl.innerHTML = '';
  saveShoppingCart();
  updateCartTotalPrice();
};

const getShoppingCart = () => {
  const cartItems = document.querySelectorAll(olCartItems);
  cartItems.forEach((element) => {
    const li = element;
    li.innerHTML = JSON.parse(localStorage.getItem('shoppingCart'));
    li.addEventListener('click', cartItemClickListener);
  });
};

const finishedLoading = () => {
  const loading = document.querySelector('.loading');
  loading.remove();
};

window.onload = () => {
  getInfoAPI('computador')
  .then(() => finishedLoading())
  .then(() => updateCartTotalPrice())
  .then(() => addToCartButton());

  getShoppingCart();
  const emptyCart = document.querySelector('.empty-cart');
  emptyCart.addEventListener('click', clearCartButton);
};