const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador'; 
const ol1 = ('.cart__items');

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

// Requisito 5
const priceTotal = () => {
const dataPrice = [...document.querySelectorAll('.cart__item')];

const arrayPrice = dataPrice.map((itemPrice) => {
const string = itemPrice.innerText.split('$').reverse()[0];
const numbers = parseFloat(string);
return numbers;
});
const soma = arrayPrice.reduce((acc, itemPrice) => (acc + itemPrice), 0);
const totalPrice = document.querySelector('.total-price');
totalPrice.innerText = `${soma}`;
return soma;
};

// requisito 4
const storangeKey = localStorage.getItem('key');

// requisito 4
const setLocalStorange = () => {
  const saveStorange = JSON.stringify(document.querySelector(ol1).innerHTML);
  localStorage.setItem('key', saveStorange);
};

function cartItemClickListener(event) {
// coloque seu código aqui
event.target.remove(); // requisito 3
priceTotal(); // requisito 5
setLocalStorange(); // requisito 4
}

// requisito 4
const getsetItemLocal = () => {
const getLi = JSON.parse(localStorage.getItem('key'));
const ol = document.querySelector('ol');
ol.innerHTML = getLi;
ol.addEventListener('click', cartItemClickListener);
};

function createCartItemElement({ sku, name, salePrice }) {
const li = document.createElement('li');
li.className = 'cart__item';
li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
li.addEventListener('click', cartItemClickListener);
return li;
}

// requisito 1
const requestMercado = () => 
fetch(API_URL)
.then((response) => response.json())
.then((result) => result.results.forEach(({ id, title, thumbnail }) => {
const item = { sku: id, name: title, image: thumbnail };
const selectItems = document.querySelector('.items');
const imgElement = createProductItemElement(item);
selectItems.appendChild(imgElement);
})); 

// requisito 2
function fetchId(idItem) { 
const valueItem = getSkuFromProductItem(idItem);
const API_ID = `https://api.mercadolibre.com/items/${valueItem}`;
fetch(API_ID)
.then((response) => response.json())
.then(({ id, title, price }) => {
const priceItem = { sku: id, name: title, salePrice: price };
const ol = document.querySelector(ol1);
const cartItem = createCartItemElement(priceItem);
ol.appendChild(cartItem);
priceTotal();
setLocalStorange();
})
.catch(() => console.log('Seu item não esta disponivel'));
}

// requisito 2
const buttonAddClick = () => {
const items = document.querySelectorAll('.item');
items.forEach((item) => item.lastChild.addEventListener('click', () => fetchId(item)));
priceTotal();
};

const clearCar = () => {
const getOl = document.querySelector(ol1);
getOl.innerHTML = '';
priceTotal();
setLocalStorange();
};

window.onload = () => {
requestMercado() // requisito 1
  .then(() => document.querySelector('.loading').remove())
  .then(() => buttonAddClick()); // requisito 2
if (storangeKey) getsetItemLocal();
const getbutton = document.querySelector('.empty-cart');
getbutton.addEventListener('click', clearCar);
};
