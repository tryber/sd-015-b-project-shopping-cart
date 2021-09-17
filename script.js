const existStorage = localStorage.getItem('actualCar');
const cartItem = ('.cart__item');
const classeCartItens = ('.cart__items');

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

function savedCar() {
  const carItems = [...document.querySelectorAll(cartItem)];
  const localStorageItem = [];

  carItems.forEach((item) => {
    localStorageItem.push(item.innerHTML);
  });
  localStorage.setItem('actualCar', JSON.stringify(localStorageItem));
}

const totalPrice = ('.total-price');
function sumCart() {
  const itemsCart = [...document.querySelectorAll(cartItem)];
//  document.querySelector(totalPrice).innerText = 0;  
  const arrayCart = itemsCart.map((item) => {
    const valueString = item.innerText.split('$').reverse()[0];
    const numbers = parseFloat(valueString, 10);
    return numbers;
  });
  const sum = arrayCart.reduce((acc, current) => (acc + current), 0);
  document.querySelector(totalPrice).innerText = `${sum}`;
  console.log(sum);
}

function cartItemClickListener(event) {
  event.target.remove();
  sumCart();
  savedCar();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function requestPcMl() {
  return fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((listItens) => listItens.results.forEach(({ id, title, thumbnail }) => {
      const output = { 
        sku: id, 
        name: title, 
        image: thumbnail, 
      };
      const selectionItems = document.querySelector('.items');
      const itemElement = createProductItemElement(output);
      selectionItems.append(itemElement);
    }));
}

async function searchId(element) {
  const idElement = getSkuFromProductItem(element);
  return fetch(`https://api.mercadolibre.com/items/${idElement}`)
  .then((response) => response.json())
  .then(({ id, title, price }) => {
    const output = {
      sku: id,
      name: title,
      salePrice: price,
    };
    const ol = document.querySelector(classeCartItens);
    ol.append(createCartItemElement(output));
    sumCart();
    savedCar();
  });
}
function addListenerButton() {
    const allItems = document.querySelectorAll('.item');
  allItems.forEach((item) => item.lastChild
  .addEventListener('click', (() => {
    searchId(item);
  })));
}

function recoveryCar() {
  const convertCar = JSON.parse(localStorage.getItem('actualCar'));
  convertCar.forEach((item) => {
    const itemsCar = document.querySelector(classeCartItens);
    const li = document.createElement('li');
    li.innerHTML = item;
    li.classList.add(cartItem);
    li.addEventListener('click', cartItemClickListener);
    itemsCar.append(li);
  });
}

function eraseButton() {
  const ol = document.createElement('ol');
  const olErase = document.querySelector(classeCartItens);
  const cart = document.querySelector('.cart');
  olErase.remove();
  ol.classList.add('cart__items');
  cart.append(ol);
  sumCart();
  savedCar();
}

function requestApi() {
  requestPcMl()
  .then(() => addListenerButton())
  .then(() => sumCart())
  .catch(() => console.error('Caminho não encontrado'));
}

window.onload = () => { 
  if (existStorage) recoveryCar();
  requestApi();
  const rmButton = document.querySelector('.empty-cart');
  rmButton.addEventListener('click', eraseButton);
};
