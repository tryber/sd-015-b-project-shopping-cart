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

function storeCart(cartContainer) {
  localStorage.setItem('cart', cartContainer.innerHTML);
}

function cartItemClickListener(event) {
  const cartContainer = event.target.parentElement;
  event.target.remove();
  storeCart(cartContainer);
}  

// function getTotalCostOfCart(cartContainer) {
//   const priceDisplay = document.querySelector('total-price');

//   const totalPrice = cartContainer.childNodes.reduce((sum, cur) => sum + cur.salePrice, 0);
// }

function getStoredCart() {
  const storedCart = localStorage.getItem('cart');
  const cartContainer = document.querySelector('.cart__items');

  cartContainer.innerHTML = storedCart;
  cartContainer.childNodes.forEach((li) => li.addEventListener('click', cartItemClickListener));
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
  const cart = document.querySelector('.cart__items');
    
  await fetchFromApi(itemUrl)
    .then((item) => ({ sku: item.id, name: item.title, salePrice: item.price }))
    .then((item) => {
      cart.appendChild(createCartItemElement(item));
    })
    .then(() => {
      storeCart(cart);
    });
}

function emptyCart() {
  const cartContainer = document.querySelector('.cart__items');

  while (cartContainer.firstChild) {
    cartContainer.removeChild(cartContainer.firstChild);
  }

  storeCart(cartContainer);
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

// function displayTotalCostofCart() {
//   const priceDisplay = document.createElement('span');
//   const priceContainer = document.createElement('p');
  
//   priceDisplay.className = 'total-price';
//   priceDisplay.innerText = 'R$ 0,00';
  
//   priceContainer.innerText = 'Total: ';
//   priceContainer.appendChild(priceDisplay);
  
//   document.querySelector('.cart').appendChild(priceContainer);
// }

window.onload = async () => {
  getStoredCart();
  // displayTotalCostofCart();
  document.querySelector('.empty-cart').addEventListener('click', emptyCart);
  await createProductList();
};
