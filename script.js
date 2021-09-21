const PC_SEARCH_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=celular';
const ITEM_BASE_URL = 'https://api.mercadolibre.com/items/';
const ADD_TO_CART_ICON = '<i class="fas fa-cart-plus"></i>';

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, innerText, ...classes) {
  const el = document.createElement(element);
  classes.forEach((cl) => {
    el.classList.add(cl);
  });
  el.innerText = innerText;
  return el;
}

function createAddToCartButton() {
  const button = document.createElement('button');
  button.className = 'item__add';
  button.innerHTML = ADD_TO_CART_ICON;
  return button;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function getCartItemsOl() {
  return document.querySelector('.cart__items');
}

function saveCartItems(ol) {
  localStorage.cartItems = ol.innerHTML;
}
function getMercadoLivreItem(id) {
  return fetch(ITEM_BASE_URL + id).then((response) => response.json());
}

async function getTotalPrice() {
  const cartItems = getCartItemsOl().children;
  const len = cartItems.length;
  let totalPrice = 0;
  const promises = [];

  for (let i = 0; i < len; i += 1) {
    const { sku } = cartItems[i].dataset;
    promises.push(getMercadoLivreItem(sku).then(({ price }) => price));
  }

  await Promise.all(promises).then((values) =>
    values.forEach((value) => {
      totalPrice += value;
    }));

  return totalPrice;
}

async function showTotalPrice() {
  getTotalPrice().then((totalPrice) => {
    const span = document.querySelector('.total-price');
    span.innerText = totalPrice;
  });
}

function cartItemClickListener(event) {
  const cartItemsOl = event.target.parentElement;
  cartItemsOl.removeChild(event.target);
  showTotalPrice();
  saveCartItems(cartItemsOl);
}

function loadCartItems() {
  if (typeof localStorage.cartItems !== 'undefined') {
    const cartItemsOl = getCartItemsOl();
    cartItemsOl.innerHTML = localStorage.cartItems;

    // transforma HTMLColection em array
    const [...cartItems] = cartItemsOl.children;
    cartItems.forEach((item) => item.addEventListener('click', cartItemClickListener));
  }
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.dataset.sku = sku;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function handleAddButton(event) {
  const itemContainer = event.target.parentElement.parentElement;
  const sku = getSkuFromProductItem(itemContainer);

  fetch(ITEM_BASE_URL + sku)
    .then((response) => response.json())
    .then(({ id, title, price }) => {
      const cartItemsOl = getCartItemsOl();
      const product = { sku: id, name: title, salePrice: price };
      cartItemsOl.appendChild(createCartItemElement(product));
      showTotalPrice();
      saveCartItems(cartItemsOl);
    });
}

const formatPrice = (price) => `R$${price.toFixed(2)}`;

function createProductItemElement({ sku, name, image, price }) {
  const section = document.createElement('section');
  const button = createAddToCartButton();
  const leftDiv = document.createElement('div');
  const rightDiv = document.createElement('div');
  section.className = 'item';
  leftDiv.className = 'item-left';
  rightDiv.className = 'item-right';

  leftDiv.appendChild(createProductImageElement(image));
  rightDiv.appendChild(createCustomElement('span', name, 'item__title'));
  rightDiv.appendChild(createCustomElement('span', formatPrice(price), 'item__price'));
  rightDiv.appendChild(button);
  
  button.addEventListener('click', handleAddButton);
  section.appendChild(createCustomElement('span', sku, 'item__sku'));
  section.appendChild(leftDiv);
  section.appendChild(rightDiv);
  return section;
}

function fillItemsSection(products) {
  const itemsSection = document.querySelector('.items');
  products.forEach(({ id, title, thumbnail, price }) => {
    itemsSection.appendChild(
      createProductItemElement({ sku: id, name: title, image: thumbnail, price })
    );
  });
}
function deleteLoading() {
  const loading = document.querySelector('.loading');
  loading.remove();
}

function showLoading() {
  const loading = document.createElement('span');
  loading.className = 'loading';
  loading.innerText = 'Loading...';
  document.body.appendChild(loading);
}

function searchMercadoLivreProducts() {
  showLoading();
  fetch(PC_SEARCH_URL)
    .then((response) => response.json())
    .then(({ results: products }) => {
      deleteLoading();
      fillItemsSection(products);
    });
}

function clearCartItems() {
  const cartItemsOl = getCartItemsOl();
  cartItemsOl.innerHTML = '';
  showTotalPrice();
}

window.onload = () => {
  const clearCartItemsButton = document.querySelector('.empty-cart');

  searchMercadoLivreProducts();
  loadCartItems();
  showTotalPrice();
  clearCartItemsButton.addEventListener('click', clearCartItems);
};
