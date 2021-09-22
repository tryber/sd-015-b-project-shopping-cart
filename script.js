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
  section.appendChild(createCustomElement('button',
    'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// url 
const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

// create cumputer
async function getComputer() { 
  const data = await fetch(API_URL);
  const getComputerSearch = await data.json();
  return getComputerSearch.results.forEach(({ id, title, thumbnail }) => {
    const resultPromisse = {
      sku: id,
      name: title,
      image: thumbnail,
    };
    const selectItems = document.querySelector('.items');
    const product = createProductItemElement(resultPromisse);
    selectItems.appendChild(product);
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const getCart = JSON.parse(localStorage.getItem('cart')) || [];

function itemlocal(item) {
  getCart.push(item);
  localStorage.setItem('cart', JSON.stringify(getCart));
}

function cleanLocal(id) {
  const itens = getCart.filter((element) => element !== id);
  localStorage.setItem('cart', JSON.stringify(itens));
}

function calcPrice() {
  const li = document.querySelectorAll('ol .cart__item');
  const cartItens = document.querySelector('.total-price');
  let count = 0;
  if (li.length > 0) {
    li.forEach((el) => {
      const stringEd = el.innerText.split('|')[2].split('$')[1];
      const number = parseFloat(stringEd);
      count += number;
      cartItens.innerText = `${count}`;
    });
    count = 0;
  } else {
    cartItens.innerText = `${li.length}`;
  }
}

//  remove itens event 'click'
function cartItemClickListener(event) {
  event.target.remove();
  const stringEd = event.target.innerText.split(' ')[1];
  cleanLocal(stringEd);
  calcPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// create item cart
async function getProductId(item) {
  const itemId = getSkuFromProductItem(item);
  const data = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const getComputerId = await data.json();
  const { id, title, price } = getComputerId;
  const resultItem = { sku: id, name: title, salePrice: price };
  const selectItems = document.querySelector('ol');
  const productt = createCartItemElement(resultItem);
  selectItems.appendChild(productt);
  itemlocal(itemId);
  calcPrice();
}

// select all buttons
function buttonProduct() {
  const itens = document.querySelectorAll('.item__add');
  return itens.forEach((iten) => {
    iten.addEventListener('click', (() => getProductId(iten.parentElement)));
  });
}

// localStorage start page
function creatCartStorage(itens) {
  itens.forEach(async (el) => {
    const data = await fetch(`https://api.mercadolibre.com/items/${el}`);
    const getComputerId = await data.json();
    const { id, title, price } = getComputerId;
    const resultItem = { sku: id, name: title, salePrice: price };
    const selectItems = document.querySelector('.cart__items');
    const productt = createCartItemElement(resultItem);
    selectItems.appendChild(productt);
    calcPrice();
  }); 
}

const cartBuyOl = document.querySelector('.cart__items');

function cleanCart() {
  cartBuyOl.innerText = '';
  calcPrice();
  localStorage.clear();
}

const buttonClean = document.querySelector('.empty-cart');
buttonClean.addEventListener('click', cleanCart);

const requestsAsincronos = async () => {
  await getComputer();
  buttonProduct();
  creatCartStorage(getCart);
};

window.onload = () => {  
  requestsAsincronos();
};
