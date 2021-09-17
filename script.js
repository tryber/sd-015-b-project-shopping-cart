const products = document.querySelector('.items');
const userItems = [];

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

function removeItem(origin) {
  const element = origin.target;
  element.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', removeItem);
  return li;
}

function createCartItemObj(item) {
  const cartItemObj = {
    sku: item.id,
    name: item.title,
    salePrice: item.price,
  };
  userItems.push(cartItemObj.sku);
  localStorage.setItem('userItems', userItems);
  const cart = document.querySelector('.cart__items');
  const listItem = createCartItemElement(cartItemObj);
  cart.appendChild(listItem);
}

async function fetchProduct(itemID) {
  return fetch(`https://api.mercadolibre.com/items/${itemID}`)
    .then((msg) => msg.json())
    .then((obj) => createCartItemObj(obj))
    .catch((err) => err);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function cartItemClickListener(event) {
  const item = event.target.parentElement;
  const itemID = getSkuFromProductItem(item);
  fetchProduct(itemID);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', cartItemClickListener);
  section.appendChild(button);
  return section;
}

// creates object to be passed to createProductItemElement and appends return to items section
function mapToDesiredObj(result) {
  const abrObject = {
    sku: result.id,
    name: result.title,
    image: result.thumbnail,
  };
  const createdProduct = createProductItemElement(abrObject);
  products.appendChild(createdProduct);
}

// maps each product to desired object
function resultsForEach(results) {
  results.forEach((result) => mapToDesiredObj(result));
}

// gets list of computers
window.onload = () => {
  async function get(url) {
    if (url === 'https://api.mercadolibre.com/sites/MLB/search?q=computador') {
      return fetch(url)
        .then((msg) => msg.json())
        .then((response) => response.results)
        .then((results) => resultsForEach(results))
        .catch((err) => err);
    }
    throw new Error('endpoint não existe');
  }
  get('https://api.mercadolibre.com/sites/MLB/search?q=computador');

  function retrieveUserData() {
    const userData = localStorage.getItem('userItems');
    console.log(userData);
  }
  retrieveUserData();
};
