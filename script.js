const olCartItems = '.cart__items';

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

const saveShoppingCart = () => {
  const cartItems = document.querySelectorAll(olCartItems);
  cartItems.forEach((element) => localStorage.setItem('shoppingCart', JSON
    .stringify(element.innerHTML)));
};

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
  saveShoppingCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addToCartAPI(searckSku) {
  const sku = getSkuFromProductItem(searckSku);
  const url = `https://api.mercadolibre.com/items/${sku}`;
  fetch(url)
  .then((data) => data.json())
  .then(({ id, title, price }) => {
    const items = document.querySelector(olCartItems);
    items.appendChild(createCartItemElement({ sku: id, name: title, salePrice: price }));
    saveShoppingCart();
  });
}

const addToCartButton = () => {
  const sections = document.querySelectorAll('.item');
  sections.forEach((section) => section.lastChild
    .addEventListener('click', () => addToCartAPI(section)));
};

async function getInfoAPI(search) {
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${search}`;
  await fetch(url)
  .then((data) => data.json())
  .then(({ results }) => results.forEach(({ id, title, thumbnail }) => {
    const items = document.querySelector('.items');
    items.appendChild(createProductItemElement(
    { sku: id, name: title, image: thumbnail },
    ));
  }));
}

const clearCartButton = () => {
  const cartItemsOl = document.querySelector(olCartItems);
  cartItemsOl.innerHTML = '';
  saveShoppingCart();
};

const getShoppingCart = () => {
  const cartItems = document.querySelectorAll(olCartItems);
  cartItems.forEach((element) => {
    const li = element;
    li.innerHTML = JSON.parse(localStorage.getItem('shoppingCart'));
    li.addEventListener('click', cartItemClickListener);
  });
};

const finishedLoading = () => {
  const loading = document.querySelector('.loading');
  loading.remove();
};

window.onload = () => {
  getInfoAPI('computador')
  .then(() => finishedLoading())
  .then(() => addToCartButton());
  
  getShoppingCart();

  const emptyCart = document.querySelector('.empty-cart');
  emptyCart.addEventListener('click', clearCartButton);
};