const localKey = localStorage.getItem('key');

const createLoading = () => {
  const p = document.createElement('p');
  p.classList = 'loading';
  p.innerText = 'loading...';
  const cartFirst = document.querySelector('.cart');
  cartFirst.appendChild(p);
};

const setItemLocal = () => {
  const saveStorage = JSON.stringify(document.querySelector('.cart__items').innerHTML);
  localStorage.setItem('key', saveStorage);
};

async function findDataML() {
  createLoading();
  const apiData = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const dataJson = await apiData.json();
  return dataJson;
}

async function findProductMl(id) {
  const apiData = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const dataJson = await apiData.json();
  return dataJson;
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

const priceSum = () => {
  const getItem = [...document.querySelectorAll('.cart__item')];
  const result = getItem.map((value) => {
    const splited = value.innerText.split('$').reverse()[0];
    const test = parseFloat(splited, 10);
    return test;
  });
  const reduceResult = result.reduce((accumulator, number) => accumulator + number, 0);
  document.querySelector('.total-price').innerText = `${reduceResult}`;
  return reduceResult;
};

function cartItemClickListener(event) {
event.target.remove('li.cart__items');
priceSum();
setItemLocal();
}

const getItemLocal = () => {
  const getLi = JSON.parse(localStorage.getItem('key'));
  const result = document.querySelector('ol');
  result.innerHTML = getLi;
  result.addEventListener('click', cartItemClickListener);
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addItemToList(id) {
  const itemOl = document.querySelector('.cart__items');
  const { title, price } = await findProductMl(id);
  const product = {
    sku: id,
    name: title,
    salePrice: price,
  };
  const itemLi = createCartItemElement(product);
  itemOl.appendChild(itemLi);
  priceSum();
  setItemLocal();
  }

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', (() => addItemToList(sku)));
  section.appendChild(button);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function addProduct({ id, title, thumbnail }) {
const productItemElement = createProductItemElement({
  sku: id,
  name: title,
  image: thumbnail,
});
const items = document.querySelector('.items');
items.appendChild(productItemElement);
}

const orderFunction = () => {
  findDataML()
  .then(() => {
    const loading = document.querySelector('.loading');
    loading.remove();
  });
};

window.onload = () => { 
  findDataML().then((jsonData) => {
    const { results } = jsonData;
    results.forEach((result) => addProduct(result));
  });
  if (localKey) getItemLocal();
  orderFunction();
};
