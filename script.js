const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

let totalPrice = 0;

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

function calculatePrice(price, type) {
  const priceCointainer = document.querySelector('.total-price');
  if (type === 'plus') { totalPrice += price; }
  if (type === 'sub') { totalPrice -= price; }
  // Fonte: https://www.ti-enxame.com/pt/javascript/como-lidar-com-precisao-do-numero-de-ponto-flutuante-em-javascript/967093093/
  priceCointainer.innerText = parseFloat((totalPrice).toFixed(2));
}

function clearStorage() {
  localStorage.clear();
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const itemID = event.target.classList[1];
  const itemUrl = `https://api.mercadolibre.com/items/${itemID}`;
  fetch(itemUrl, { method: 'GET' })
    .then((response) => response.json())
    .then((data) => calculatePrice(data.price, 'sub'));
  // Remove o elemento do localStorage
  event.target.remove();
}

function emptyCart(event) {
  // reseta o preço para 0 
  const totalPriceReset = document.querySelector('.total-price');
  totalPriceReset.innerText = 0;
  // remove os items do cart
  const cartOl = document.querySelector('ol');
  while (cartOl.firstChild) {
    cartOl.removeChild(cartOl.firstChild);
  }
  // remove todos os items do localStorage
  clearStorage();
}

function createListenerCartItem(li) {
  li.addEventListener('click', cartItemClickListener);
}
const saveItem = (sku, li) => window.localStorage.setItem(sku, li.innerText);

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = `cart__item, ${sku}`;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  createListenerCartItem(li);
  // Adiciona item ao localStorage
  saveItem(sku, li);
  return li;
}
async function addElementToCart(event) {
  const itemID = event.target.parentNode.firstChild.innerText;
  const itemUrl = `https://api.mercadolibre.com/items/${itemID}`;
  const cartContainer = document.querySelector('.cart .cart__items');
  fetch(itemUrl, { method: 'GET' })
  .then((response) => response.json())
  .then((data) => {
    const product = {
      sku: data.id,
      name: data.title,
      salePrice: data.price.toString(),
    };
    const item = createCartItemElement(product);
    cartContainer.appendChild(item);
    calculatePrice(data.price, 'plus');
  })
  .catch(() => console.log('Error: invalid ID'));
}

function addEvents() {
  const buttons = document.querySelectorAll('.item__add');
  for (let i = 0; i < buttons.length; i += 1) {
    buttons[i].addEventListener('click', addElementToCart);
   }
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', emptyCart);
 }

function fetchMercadoLivreAPI() {
  const productSection = document.querySelector('.items');
  const init = {
    method: 'GET',
  };
  fetch(API_URL, init)
    .then((response) => response.json())
    .then((data) => {
      data.results.forEach((product) => {
        const productInfo = { sku: product.id, name: product.title, image: product.thumbnail };
        const element = createProductItemElement(productInfo);
        productSection.appendChild(element);
      });
      addEvents();
      const loading = document.querySelector('.loading');
      loading.remove();
    })
    .catch(() => console.log('Error: failed to request'));
}

function restoreCart() {
  const localStorageLength = window.localStorage.length;
  for (let i = 0; i < localStorageLength; i += 1) {
    const localKey = window.localStorage.key(i);
    const itemUrl = `https://api.mercadolibre.com/items/${localKey}`;
    const ol = document.querySelector('.cart__items');
    const item = document.createElement('li');
    item.className = `cart__item, ${localKey}`;
    item.innerText = window.localStorage.getItem(localKey);
    ol.appendChild(item);
    // chama função que calcula preço
    fetch(itemUrl, { method: 'GET' })
    .then((response) => response.json())
    .then((data) => calculatePrice(data.price, 'plus'));
    // chama função que adiciona eventos aos items do carrinho
    createListenerCartItem(item);
  }
}

function verifyStorage() {
  const { length } = window.localStorage;
  if (length !== 0) {
    restoreCart();
  }
}

window.onload = () => { 
  fetchMercadoLivreAPI();
  verifyStorage();
};
