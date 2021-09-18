const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const teste = ('.cart__items');

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

const getApi = () => 
  fetch(API_URL)
  .then((response) => response.json())
  .then((results) => results.results.forEach(({ id, title, thumbnail }) => {
    const item = { 
      sku: id, 
      name: title, 
      image: thumbnail, 
    };
    const getItems = document.querySelector('.items');
    const itemElement = createProductItemElement(item);
    getItems.appendChild(itemElement);
  }));

const saveItemLocal = () => {
  const getOl = document.querySelectorAll(teste);
  getOl.forEach((elemento) => localStorage.setItem('key', JSON.stringify(elemento.innerHTML)));
};

function cartItemClickListener(event) {
  event.target.remove();
  saveItemLocal();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getItemLocal = () => {
  const getOl = document.querySelectorAll(teste);
  getOl.forEach((elemento) => {
    const ele = elemento;
    ele.innerHTML = JSON.parse(localStorage.getItem('key'));
    ele.addEventListener('click', cartItemClickListener);
  });
};

const getId = (idItem) => {
  const valueItem = getSkuFromProductItem(idItem);
  const API_ID = `https://api.mercadolibre.com/items/${valueItem}`;
  fetch(API_ID)
  .then((response) => response.json())
  .then(({ id, title, price }) => {
    const priceItem = {
      sku: id,
      name: title,
      salePrice: price,
    };
  const getLi = createCartItemElement(priceItem);
  const getOl = document.querySelector(teste);
  getOl.appendChild(getLi);
  saveItemLocal();
  })
  .catch(() => console.log('erro na função getId'));
};

const button = () => {
  const getSections = document.querySelectorAll('.item');
  getSections.forEach((elemento) => 
  elemento.lastChild.addEventListener('click', () => getId(elemento)));
};

window.onload = () => {
  getApi()
  .then(() => button());
  getItemLocal();
 };
