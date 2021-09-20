const products = document.querySelector('.items');
const emptyCart = document.querySelector('.empty-cart');
let userItems = [];
const skuLength = 18;
let total = 0;

// creates image element
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// creates custom element (custom class + custom innerText)
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// Source: https://stackoverflow.com/a/32229831
// updates total price and displays on screen
function updateTotal(totalPrice) {
  const cartTotal = document.querySelector('.total-price');
  // adds decimals if needed (+), maximum of 2 decimals allowed (truncates)
  const correctTotalPrice = +totalPrice.toFixed(2);
  cartTotal.innerText = correctTotalPrice;
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
  // removes item from array
  userItems.splice(userItems.indexOf(sku), 1);
  localStorage.setItem('userItems', JSON.stringify(userItems));
}

// calls to remove item from local storage and removes element from HTML
function removeItem(origin) {
  removeItemFromStorage(origin);
  const element = origin.target;
  element.remove();
}

// clear cart function, sets local storage, total, cart to 0
function doEmptyCart() {
  const productList = document.querySelector('.cart__items');
  productList.innerText = '';
  userItems = [];
  localStorage.setItem('userItems', userItems);
  total = 0;
  updateTotal(total);
}

// creates cart item element
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
  const loader = document.querySelector('.loading');
  loader.remove();
  results.forEach((result) => mapToDesiredObj(result));
}

// loads cart on initialization, if user has data in local storage
async function loadCart(userData) {
  await userData.forEach((item) => fetchProduct(item));
}

// checks local storage
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
  const itemsSection = document.querySelector('.items');
  const loader = createCustomElement('div', 'loading', 'loading...');
  itemsSection.appendChild(loader);
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
