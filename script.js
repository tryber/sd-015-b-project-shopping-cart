const products = document.querySelector('.items');
const emptyCart = document.querySelector('.empty-cart');
let userItems = [];
const skuLength = 18;
let total = 0;

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

// Source: https://stackoverflow.com/a/32229831
function toFixedIfNecessary(value, dp) {
  return +parseFloat(value).toFixed(dp);
}

function updateTotal(totalPrice) {
  const carTotal = document.querySelector('.total-price');
  const correctTotalPrice = toFixedIfNecessary(totalPrice, 2);
  carTotal.innerText = correctTotalPrice;
}

function removeItemFromStorage(origin) {
  const elementText = origin.target.innerText;
  const elementTextLength = elementText.length;
  const skuKeyLength = 'SKU: '.length;
  const priceKeyLength = 'PRICE: $'.length;
  const initialPosSku = elementText.search('SKU: ') + skuKeyLength;
  const initialPosPrice = elementText.search('PRICE: ') + priceKeyLength;
  const sku = elementText.slice(initialPosSku, skuLength);
  const price = elementText.slice(initialPosPrice, elementTextLength);
  total -= price;
  updateTotal(total);
  userItems.splice(userItems.indexOf(sku), 1);
  localStorage.setItem('userItems', JSON.stringify(userItems));
}

function removeItem(origin) {
  removeItemFromStorage(origin);
  const element = origin.target;
  element.remove();
}

function doEmptyCart() {
  const productList = document.querySelector('.cart__items');
  productList.innerText = '';
  userItems = [];
  localStorage.setItem('userItems', userItems);
  total = 0;
  updateTotal(total);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', removeItem);
  return li;
}

function addCartItemToStorage(item) {
  const { sku } = item;
  userItems.push(sku);
  localStorage.setItem('userItems', JSON.stringify(userItems));
}

function createCartItemObj(item) {
  const cartItemObj = {
    sku: item.id,
    name: item.title,
    salePrice: item.price,
  };
  const { salePrice } = cartItemObj;
  total += salePrice;
  updateTotal(total);
  addCartItemToStorage(cartItemObj);
  const cart = document.querySelector('.cart__items');
  const listItem = createCartItemElement(cartItemObj);
  cart.appendChild(listItem);
}

async function fetchProduct(itemID) {
  return fetch(`https://api.mercadolibre.com/items/${itemID}`)
    .then((msg) => msg.json())
    .then((obj) => createCartItemObj(obj))
    .catch((err) => err);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function cartItemClickListener(event) {
  const item = event.target.parentElement;
  const itemID = getSkuFromProductItem(item);
  await fetchProduct(itemID);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', cartItemClickListener);
  section.appendChild(button);
  return section;
}

// creates object to be passed to createProductItemElement and appends return to items section
function mapToDesiredObj(result) {
  const abrObject = {
    sku: result.id,
    name: result.title,
    image: result.thumbnail,
  };
  const createdProduct = createProductItemElement(abrObject);
  products.appendChild(createdProduct);
}

// maps each product to desired object
function resultsForEach(results) {
  results.forEach((result) => mapToDesiredObj(result));
}

async function loadCart(userData) {
  await userData.forEach((item) => fetchProduct(item));
}

function retrieveUserData() {
  const userData = localStorage.getItem('userItems');
  if (userData) {
    loadCart(JSON.parse(userData));
  } else {
    localStorage.setItem('userItems', JSON.stringify(userItems));
  }
}

// gets list of computers
window.onload = () => {
  async function get(url) {
    if (url === 'https://api.mercadolibre.com/sites/MLB/search?q=computador') {
      return fetch(url)
        .then((response) => response.json())
        .then((msg) => msg.results)
        .then((results) => resultsForEach(results))
        .catch((err) => err);
    }
    throw new Error('endpoint não existe');
  }
  get('https://api.mercadolibre.com/sites/MLB/search?q=computador');    
  retrieveUserData();
  emptyCart.addEventListener('click', doEmptyCart);
};
