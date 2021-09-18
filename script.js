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

async function requestComputador() {
  const API_ML = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const data = await fetch(API_ML);
  const result = await data.json();

  return result;
}

function addProducts(products) {
  const section = document.querySelector('.items');
  products.results.forEach(({ id, title, thumbnail }) => {
    const createProduct = createProductItemElement({ sku: id, name: title, image: thumbnail });
    section.appendChild(createProduct);
  });
}

function cartItemClickListener(event) {
  const buttonAdd = document.querySelector('.item_add');
  event.target.remove();
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  return li;
}

async function addIdComputer(actualId) {
  const idComputer = getSkuFromProductItem(actualId);
  const API_ID = `https://api.mercadolibre.com/items/${idComputer}`;
  
  const data = await fetch(API_ID);
  const computer = await data.json();
  const { id, title, price } = computer;
  const dataComputer = {
    sku: id,
    name: title,
    salePrice: price,
  };
  const olCart = document.querySelector('.cart__items');
  olCart.appendChild(createCartItemElement(dataComputer));
}

function addEventButtons() {
  const items = document.querySelectorAll('.item');
  items.forEach((item) => item.lastChild.addEventListener('click', (() => {
    addIdComputer(item);
  })));
}

async function allFunctionsCalled() {
  try {
    const product = await requestComputador();
    addProducts(product);
    addEventButtons();
  } catch (error) {
    throw new Error(error);
  }
}

window.onload = () => {
  allFunctionsCalled();
 };
