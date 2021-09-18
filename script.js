function selectCartContainer() {
  return document.querySelector('.cart__items');
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

function updateTotalPrice() {
  const priceDisplay = document.querySelector('.total-price');
  const cartItems = Array.from(selectCartContainer().childNodes);
  const prices = cartItems.map((item) => parseFloat(item.innerText.split('$')[1], 10));
  const total = prices.reduce((sum, price) => sum + price, 0);

  priceDisplay.innerText = total;
}

function storeCart(cartContainer) {
  localStorage.setItem('cart', cartContainer.innerHTML);
}

function cartItemClickListener(event) {
  event.target.remove();
  updateTotalPrice();
  storeCart(selectCartContainer());
}  

async function getStoredCart() {
  const storedCart = localStorage.getItem('cart');
  const cartContainer = await selectCartContainer();

  cartContainer.innerHTML = storedCart;
  cartContainer.childNodes.forEach((li) => li.addEventListener('click', cartItemClickListener));

  updateTotalPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function fetchFromApi(endpoint) {
  const endpointFormat = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };  

  return fetch(endpoint, endpointFormat)
    .then((response) => response.json());
}

async function addItemToCart(event) {
  const productId = getSkuFromProductItem(event.target.parentElement);
  const itemUrl = `https://api.mercadolibre.com/items/${productId}`;
  const cart = await selectCartContainer();
    
  await fetchFromApi(itemUrl)
    .then(({ id, title, price }) => ({ sku: id, name: title, salePrice: price }))
    .then((item) => {
      cart.appendChild(createCartItemElement(item));
    })
    .then(() => {
      updateTotalPrice();
      storeCart(cart);
    });
}

function emptyCart() {
  const cartContainer = selectCartContainer();

  while (cartContainer.firstChild) {
    cartContainer.removeChild(cartContainer.firstChild);
  }

  updateTotalPrice();
  storeCart(selectCartContainer());
}

function createPriceDisplay() {
  const cart = document.querySelector('.cart');
  const priceDisplay = document.createElement('p');
  priceDisplay.className = 'total-price';
  priceDisplay.innerText = 0;
  cart.appendChild(priceDisplay);
}

async function createProductList() {
  const queryTarget = 'computador';
  const queryUrl = `https://api.mercadolibre.com/sites/MLB/search?q=${queryTarget}`;
  const itemsDisplay = document.querySelector('.items');

  await fetchFromApi(queryUrl)
  .then(({ results }) => results.map((item) => ({
    sku: item.id,
    name: item.title,
    image: item.thumbnail })))
  .then((list) => list.forEach((item) => {
    const productItemElement = createProductItemElement(item);
    productItemElement.querySelector('.item__add').addEventListener('click', addItemToCart);
    itemsDisplay.appendChild(productItemElement);
  }));
}

window.onload = async () => {
  createPriceDisplay();
  getStoredCart();
  document.querySelector('.empty-cart').addEventListener('click', emptyCart);
  await createProductList();
};
