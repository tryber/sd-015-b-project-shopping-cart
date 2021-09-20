// const fetch = require('node-fetch');
const URL_API = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const cartElement = document.querySelector('.cart__items');

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
  return item.innerText;
}

function storeItems() {
  localStorage.setItem('cart', cartElement.innerHTML);
}

function cartItemClickListener(event) {
  event.target.remove();

  storeItems();
}

function getItems() {
  const cartItems = localStorage.getItem('cart');

  cartElement.innerHTML = cartItems;

  const childrenCollection = cartElement.children;

  const childrensList = [...childrenCollection];

  childrensList.forEach((item) => item.addEventListener('click', cartItemClickListener));
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function findId() {
  const buttonId = document.querySelector('.item__add');
  buttonId.addEventListener('click', (event) => event.target.className);
}

async function productList() {
  const response = await fetch(URL_API);

  const jsonResponse = await response.json();

  jsonResponse.results.forEach(({ id, title, thumbnail }) => {
    const item = { sku: id, name: title, image: thumbnail };
    const products = createProductItemElement(item);
    const list = document.querySelector('.items');
    list.appendChild(products);
  });
}

async function addToCart(event) {
  const element = event.target.parentElement.firstChild;

  const elementId = getSkuFromProductItem(element);

  const response = await fetch(`https://api.mercadolibre.com/items/${elementId}`);

  const jsonReponse = await response.json();

  const { id, title, price } = jsonReponse;

  const functionReturn = createCartItemElement({ sku: id, name: title, salePrice: price });

  cartElement.appendChild(functionReturn);

  storeItems();
}

function handleClick() {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => button.addEventListener('click', addToCart));
}

window.onload = async () => {
  await productList();
  handleClick();
  findId();
  getItems();
};
