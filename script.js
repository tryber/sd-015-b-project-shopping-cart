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

function getSkuFromProductItem(card) {
  return card.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const onclick = event.target;
  onclick.remove();
}

function removeAllCart() {
  const buttonRemoveAll = document.querySelector('.empty-cart');
  const cartItems = document.querySelector('.cart__items');
  buttonRemoveAll.addEventListener('click', () => {
    cartItems.innerHTML = '';
  });
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function loading() {
  const section = document.querySelector('.container');
  const spanLoading = createCustomElement('span', 'loading', 'Loading...');
  section.appendChild(spanLoading);
}

function load() {
  const spanLoad = document.querySelector('.loading');
  spanLoad.remove();
}

async function fetchProducts() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const products = await response.json();
  load();
  return products;
}

async function requestProduct() {
  try {
    const items = await fetchProducts();
    // load();
    items.results.forEach(({ id, thumbnail, title }) => {
      const itensObjects = { sku: id, name: title, image: thumbnail };
      const classItems = document.querySelector('.items');
      const element = createProductItemElement(itensObjects);
      classItems.appendChild(element);
    });
  } catch (error) {
    console.log('Error requestProduct');
  }
}

function getLocalstorage() {
  return JSON.parse(localStorage.getItem('item'));
}

function setLocalstorage(params) {
  const valor = getLocalstorage() || [];
  localStorage.setItem('item', JSON.stringify([...valor, params]));
  // console.log(valor);
}

function createElement(params) {
  const liElement = createCartItemElement(params);
  const olElement = document.querySelector('.cart__items');
  olElement.append(liElement);
}

async function fetchCartProduct(objectCard) {
  const itemID = getSkuFromProductItem(objectCard);
  const response = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
  const result = await response.json();
  // console.log(result);
  return result;
}

async function requestCartProduct(objectCard) {
  const { id, title, price } = await fetchCartProduct(objectCard);
  const itemsObject = { sku: id, name: title, salePrice: price };
  createElement(itemsObject);
  setLocalstorage(itemsObject);
}

function cardButton() {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((but) => but.addEventListener('click', () => {
  requestCartProduct(but.parentElement);
  }));
}

function setInitialCart() {
  const itemsStorages = getLocalstorage();
  if (itemsStorages !== null) itemsStorages.forEach((item) => createElement(item));
}

const requestsAsincronos = async () => {
  try {
    await requestProduct();
    cardButton();
    await requestCartProduct();
  } catch (error) {
    console.log('Erro na função async');
  }
};

window.onload = () => { 
  loading();
  requestsAsincronos();
  // load();
  setInitialCart();
  removeAllCart();
};
