const items = document.querySelector('.items');
const cartItems = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');
const clear = document.querySelector('.empty-cart');

async function requestComputadores() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const computadores = await response.json();
  return computadores.results;
}

async function requestItemById(id) {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const computador = await response.json();
  return computador;
}

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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function createLoading() {
  const container = document.querySelector('.container');
  const div = document.createElement('div');
  div.innerText = 'loading...';
  div.className = 'loading';
  container.appendChild(div);
}

function removeLoading() {
  document.querySelector('.loading').remove();
}

let ab = setTimeout(() => console.log('sayro'), 3000);

async function createItems() {
  createLoading();
  const computadores = await requestComputadores();
  computadores.forEach((computador) => items.appendChild(createProductItemElement(computador)));
  removeLoading();
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function saveCartLocal() {
  localStorage.setItem('cart', cartItems.innerHTML);
}

// soma o preço total dos itens do
function sumTotalPrice() {
  const cartItenSum = Array.from(document.getElementsByClassName('cart__item'));
  const sum = cartItenSum.reduce((acc, ele) => Number(ele.getAttribute('price')) + acc, 0);
  totalPrice.innerText = sum;
}

// remove itens do carrinho
function cartItemClickListener(event) {
  event.target.remove();
  sumTotalPrice();
  saveCartLocal();
}

cartItems.addEventListener('click', cartItemClickListener);

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.setAttribute('price', salePrice);
  console.log(li.value);
  li.addEventListener('click', cartItemClickListener);
  return li;
}
// cria os itens do carrinho de compra
async function createCartItems(id) {
  const itemById = await requestItemById(id);
  cartItems.appendChild(createCartItemElement(itemById));
  sumTotalPrice();
  saveCartLocal();
}

// adiciona item ao carrinho
items.addEventListener('click', (event) => {
  const ev = event.target;
  if (ev.classList.contains('item__add')) {
    const parentBtn = ev.parentElement;
    createCartItems(getSkuFromProductItem(parentBtn));
  }
});

function loadCartLocal() {
  cartItems.innerHTML = localStorage.getItem('cart');
}

// limpa o carrinho
function clearCart() {
  const cart = Array.from(document.getElementsByClassName('cart__item'));
  cart.forEach((item) => item.remove());
  totalPrice.innerHTML = 0;
}

clear.addEventListener('click', clearCart);

window.onload = () => { 
  createItems();
  loadCartLocal();
 };
