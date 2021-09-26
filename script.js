const urlApiMercadoLivre = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function getCartItems() {
  const ol = document.querySelectorAll('.cart__item');
  return ol;
}

function saveToLocalStorage() {
  const cart = getCartItems();
  const itemsToStore = [];

  cart.forEach((item) => {
    itemsToStore.push(item.innerHTML);
  });

  localStorage.setItem('savedCart', JSON.stringify(itemsToStore));
}

function calcTotalPrice() {
  const ol = getCartItems();
  let totalPrice = 0;
  ol.forEach((li) => {
    const itemArrInfo = li.innerText.replace('SKU: ', '')
     .replace('NAME: ', '').replace('PRICE: $', '').split(' | ');
    const itemPrice = Number(itemArrInfo[2]);
    totalPrice += itemPrice;
  });
  if (Number.isInteger(totalPrice)) return totalPrice;
  
  const roundedNumber = Math.round(totalPrice * 100) / 100;

  return roundedNumber;
}

function displayTotalPrice() {
  const priceText = document.querySelector('.total-price');
  priceText.innerText = calcTotalPrice();
}

function cartItemClickListener(event) {
  event.target.remove();
  displayTotalPrice();
  saveToLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addItemToCart() {
  const itemId = getSkuFromProductItem(this.parentElement);
  const itemApiUrl = `https://api.mercadolibre.com/items/${itemId}`;
  
  return fetch(itemApiUrl)
    .then((response) => response.json())
    .then(({ title, price }) => {
      const item = document.querySelector('.cart__items');
      const itemInfo = {
        sku: itemId,
        name: title,
        salePrice: price,
      };

      item.appendChild(createCartItemElement(itemInfo));
      displayTotalPrice();
      saveToLocalStorage();
    });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', addItemToCart);

  return section;
}

async function createProductsList(url) {
  const appendProduct = ({ id, title, thumbnail }) => {
    const productInfo = {
      sku: id,
      name: title,
      image: thumbnail,
    };
    const productsList = document.querySelector('.items');
    const product = createProductItemElement(productInfo);
    productsList.appendChild(product);
  };

  return fetch(url)
    .then((response) => response.json())
    .then((endpointReturnedObject) => endpointReturnedObject)
    .then((object) => object.results.forEach(appendProduct));
}

function reloadCart() {
  const itemsList = document.querySelector('.cart__items');
  const localStorageCart = JSON.parse(localStorage.getItem('savedCart')) || [];
  localStorageCart.forEach((item) => {
    const itemArrInfo = item.replace('SKU: ', '')
     .replace('NAME: ', '').replace('PRICE: $', '').split(' | ');
    const itemObjInfo = {
      sku: itemArrInfo[0],
      name: itemArrInfo[1],
      salePrice: itemArrInfo[2],
    };
    itemsList.appendChild(createCartItemElement(itemObjInfo));
  });
}

function clearCart() {
  const ol = getCartItems();
  ol.forEach((li) => li.remove());
  displayTotalPrice();
  saveToLocalStorage();
}

function addClearButtonEvent() {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', clearCart);
}

function constructor() {
  createProductsList(urlApiMercadoLivre)
    .then(() => reloadCart())
    .then(() => addClearButtonEvent())
    .then(() => displayTotalPrice())
    .catch((error) => error);
}

window.onload = () => {
  constructor();
};
