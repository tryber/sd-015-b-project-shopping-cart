async function fetchProductList() {
  const queryTarget = 'computador';
  const queryUrl = `https://api.mercadolibre.com/sites/MLB/search?q=${queryTarget}`;
  const endpointFormat = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };

  const fetchResult = fetch(queryUrl, endpointFormat)
    .then((response) => response.json())
    .then((data) => data.results);

    return fetchResult;
}

async function fetchProductItem(event) {
  const productItem = event.target.parentElement;
  const productId = getSkuFromProductItem(productItem);
  const itemUrl = `https://api.mercadolibre.com/items/${productId}`;
  const endpointFormat = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };

  const fetchResult = fetch(itemUrl, endpointFormat)
    .then((response) => response.json())
    .then((data) => data);

    return fetchResult;
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

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}  

async function transformProductToCartItem(event) {
  const cartItem = await fetchProductItem(event)
    .then((item) => ({
      sku: item.id,
      name: item.title,
      salePrice: item.price,
    }));

    return cartItem;
}

async function addItemToCart(event) {
  const cart = document.querySelector('.cart__items');

  await transformProductToCartItem(event)
    .then((item) => {
      const cartItemElement = createCartItemElement(item);
      cart.appendChild(cartItemElement);
    });
    // .then(() => addClickListenersToProductItems());
}

async function transformProductList() {
  const productList = await fetchProductList()
  .then((list) => list.map((item) => ({
    sku: item.id,
    name: item.title,
    image: item.thumbnail })));
    
    return productList;
}

function addClickListenersToProductItems() {
  const addToCartButtons = document.querySelectorAll('.item__add');
  addToCartButtons.forEach((button) => button.addEventListener('click', addItemToCart));
}
  
async function createProductList() {
  const itemsDisplay = document.querySelector('.items');

  await transformProductList()
    .then((list) => list.forEach((item) => {
      const productItemElement = createProductItemElement(item);
      itemsDisplay.appendChild(productItemElement);
    }))
    .then(() => addClickListenersToProductItems());
}

window.onload = () => {
  console.log(createProductList());
};
