const urlML = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const storagedCart = localStorage.getItem('Cart');

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

function saveCart() {
  const cartItems = [...document.querySelectorAll('.cart__item')];
  const cart = cartItems.map((item) => item.innerHTML);
  localStorage.setItem('Cart', JSON.stringify(cart));
}

function cartPrice() {
  const cartItems = [...document.querySelectorAll('.cart__item')];
  const price = document.querySelector('.total-price');
  const values = cartItems.map((item) => {
    let strItemPrice = item.innerText.split('$');
    strItemPrice = strItemPrice[strItemPrice.length - 1];
    const floatItemPrice = parseFloat(strItemPrice);
    return floatItemPrice;
  });
  const total = values.reduce((acc, float) => acc + float, 0);
  price.innerText = `${total}`;
  if (cartItems.length === 0) price.innerHTML = '';
}

function cartItemClickListener(event) {
  event.target.remove();
  cartPrice();
  saveCart();
}

function createLastCart() {
  const cartItemsContainer = document.querySelector('.cart__items');
  const lastCart = JSON.parse(localStorage.getItem('Cart'));
  lastCart.forEach((cartItem) => {
    const newCartItem = document.createElement('li');
    newCartItem.innerHTML = cartItem;
    newCartItem.classList.add('cart__item', 'empty');
    newCartItem.addEventListener('click', cartItemClickListener);
    cartItemsContainer.appendChild(newCartItem);
  });
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.classList.add('cart__item', 'empty');
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createLoading() {
  const infoContainer = document.querySelector('.info-container');
  const LoadingText = document.createElement('p');
  LoadingText.innerText = 'Loading API...';
  LoadingText.className = 'loading';
  infoContainer.appendChild(LoadingText);
}

function removeLoading() {
  const loading = document.querySelector('.loading');
  if (loading) loading.remove();
}

async function requestFromML(api) {
  createLoading();
  return fetch(api)
  .then((response) => response.json())
  .then((itemsInfo) => itemsInfo.results.forEach(({ id, title, thumbnail }) => {
    const ItemData = {
      sku: id,
      name: title,
      image: thumbnail,
    };
    const itemSection = document.querySelector('.items');
    const item = createProductItemElement(ItemData);
    itemSection.appendChild(item);
    removeLoading();
  })).catch(() => console
  .log('Não foi possível se conectar a API do Mercado Livre para criar os itens da página.'));
}

async function requestID(item) {
  const productID = getSkuFromProductItem(item);
  createLoading();
  return fetch(`https://api.mercadolibre.com/items/${productID}`)
  .then((response) => response.json())
  .then(({ id, title, price }) => {
    const productData = {
      sku: id,
      name: title,
      salePrice: price,
    };
    const cartItems = document.querySelector('.cart__items');
    cartItems.appendChild(createCartItemElement(productData));
    cartPrice();
    saveCart();
    removeLoading();
  });
}

function addToCart() {
  const items = document.querySelectorAll('.item');
  items.forEach((item) => item.lastChild.addEventListener('click', () => requestID(item)));
}

function emptyCart() {
  const cartItems = document.querySelectorAll('.empty');
  cartItems.forEach((item) => item.remove());
  cartPrice();
  saveCart();
}

window.onload = () => { 
  const emptyCartBtn = document.querySelector('.empty-cart');
  requestFromML(urlML)
  .then(() => addToCart())
  .then(() => cartPrice())
  .catch(() => console.log('Não foi possível adicionar o item ao carrinho.'));
  if (storagedCart) createLastCart();
  emptyCartBtn.addEventListener('click', emptyCart);
};
