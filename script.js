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

function appendProduct({ id: sku, title: name, thumbnail: image }) {
  const section = document.querySelector('.items');
  section.appendChild(createProductItemElement({ sku, name, image }));
}

async function fetchAPI(query = 'computador') {
  const ENDPOINT = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
  const responseJSON = await fetch(ENDPOINT).then((response) => response.json());
  const { results } = responseJSON;
  results.forEach((element) => appendProduct(element));
}

function addButtonListener() {
  const arrayOfButtons = document.querySelectorAll('.item__add');
  arrayOfButtons.forEach((button) => button.addEventListener('click', addItemToCartClickListener));
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  addButtonListener();

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function getId(button) {
  return getSkuFromProductItem(button.parentElement);
}

async function addItemToCartClickListener(event) {
  const id = getId(event.target);
  const ENDPOINT = `https://api.mercadolibre.com/items/${id}`;

  const responseJSON = await fetch(ENDPOINT).then((response) => response.json());
  const { id: sku, title: name, price: salePrice } = responseJSON;

  const cart = document.querySelector('.cart__items');
  cart.appendChild(createCartItemElement({ sku, name, salePrice }));
}

function cartItemClickListener(event) {
  const cart = document.querySelector('.cart__items');
  cart.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function deleteCart() {
  const cart = document.querySelector('.cart__items');
  cart.innerHTML = '';
}

function addDeleteCartListener() {
  const emptyCart = document.querySelector('.empty-cart');
  emptyCart.addEventListener('click', deleteCart);
}

window.onload = () => {
  fetchAPI();
  addDeleteCartListener();
};
