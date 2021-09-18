const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const ol = ('.cart__items');

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
  const getOl = document.querySelectorAll(ol);
  getOl.forEach((elemento) => localStorage.setItem('carinho', JSON.stringify(elemento.innerHTML)));
};

const totalValue = () => {
  const arrGetLis = [];
  const getLis = document.querySelectorAll('.cart__item');
  for (let i = 0; i < getLis.length; i += 1) {
    arrGetLis.push(getLis[i]);
  }
  const arrValue = arrGetLis.map((elemento) => {
    const getValue = elemento.innerText.split('$')[1];
    const priceNumber = parseFloat(getValue);
    return priceNumber;
  });
  const sumPrice = arrValue.reduce((acc, elemento) => acc + elemento, 0);
  const getPrice = document.querySelector('.total-price');
  getPrice.innerText = parseFloat(sumPrice.toFixed(2));
  return sumPrice;
};

function cartItemClickListener(event) {
  event.target.remove();
  totalValue();
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
  const getOl = document.querySelectorAll(ol);
  getOl.forEach((elemento) => {
    const lis = elemento;
    lis.innerHTML = JSON.parse(localStorage.getItem('carinho'));
    lis.addEventListener('click', cartItemClickListener);
  });
};

const addProductToCart = (idItem) => {
  const valueItem = getSkuFromProductItem(idItem);
  const API_ID = `https://api.mercadolibre.com/items/${valueItem}`;
  fetch(API_ID)
  .then((response) => response.json())
  .then(({ id, title, price }) => {
    const item = {
      sku: id,
      name: title,
      salePrice: price,
    };
  const getLi = createCartItemElement(item);
  const getOl = document.querySelector(ol);
  getOl.appendChild(getLi);
  totalValue();
  saveItemLocal();
  })
  .catch(() => console.log('erro na função addProductToCart'));
};

const button = () => {
  const getSections = document.querySelectorAll('.item');
  getSections.forEach((elemento) => 
  elemento.lastChild.addEventListener('click', () => addProductToCart(elemento)));
  totalValue();
};

const clearCart = () => {
  const getValue = document.querySelector('.total-price');
  const getOl = document.querySelector('.cart__items');
  getOl.innerHTML = '';
  getValue.innerHTML = '';
  saveItemLocal();
};

window.onload = () => {
  getApi()
  .then(() => button());
  getItemLocal();
  const getButton = document.querySelector('.empty-cart');
  getButton.addEventListener('click', clearCart);
 };
