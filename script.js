const cardItems = '.cart__items';
// const cardItems = document.querySelector('.cart__items');

const saveStorage = () => {
  const list = document.querySelector(cardItems).innerHTML;
  localStorage.list = list;
};

const loadStorage = () => {
  if (localStorage.list) {
    document.querySelector(cardItems).innerHTML = localStorage.list;
  }
};

function sumTotalPrice() {
  // const totalPrice = document.querySelector('.total-price');
  // const sum = .reduce((acumulator, currency) => 
  // currency.getAttribute('price') + acumulator, 0);
  // totalPrice.innerText = sum;
}

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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  const addItems = document.querySelector('.items');
  return addItems.appendChild(section);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
  saveStorage();
}

const removeCart = () => {
 
};

function createCartItemElement({ sku, name, salePrice }) {
  const objectList = document.createElement('li');
  objectList.className = 'cart__item';
  objectList.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  objectList.addEventListener('click', cartItemClickListener);
  saveStorage();
  return objectList;
}

function listProduct() {
  document
    .querySelectorAll('.cart__item')
    .forEach((element) =>
      element.addEventListener('click', cartItemClickListener));
}

const URL = 'https://api.mercadolibre.com/';
const idItemUrl = 'https://api.mercadolibre.com/items/';
const addCart = (id) => {
  const endpoint = `${idItemUrl}${id}`;
  fetch(endpoint)
    .then((response) => response.json())
    .then((response) => {
      const { title, price } = response;
      const objectList = createCartItemElement({
        sku: id,
        name: title,
        salePrice: price,
      });
      const cartList = document.querySelector(cardItems);
      cartList.appendChild(objectList);
    })
    .finally(() => saveStorage());
};

const apiEndpoint = () => {
  const endpoint = `${URL}sites/MLB/search?q=computador`;
  const load = document.createElement('div');
  load.classList.add('loading');
  load.innerHTML = 'loading...';
  document.querySelector('.container').appendChild(load);
  fetch(endpoint)
    .then((response) => response.json())
    .then((item) =>
      item.results.forEach((element) => {
        const section = createProductItemElement(element);
        section.lastChild.addEventListener('click', (event) => {
          const idRequest = getSkuFromProductItem(event.target.parentElement);
          addCart(idRequest);
        });
      }))
    .finally(() => document.querySelector('.container').removeChild(load));
};

window.onload = function onload() {
  apiEndpoint();
  loadStorage();
  removeCart();
  listProduct();
  sumTotalPrice();
};
