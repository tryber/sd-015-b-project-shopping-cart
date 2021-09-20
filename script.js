const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
let totalPrice = 0;

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

function calculatePrice(price, type) {
  const priceCointainer = document.querySelector('.total-price');
  if (type === 'plus') { totalPrice += price; }
  if (type === 'sub') { totalPrice -= price; }
  // Fonte: https://www.ti-enxame.com/pt/javascript/como-lidar-com-precisao-do-numero-de-ponto-flutuante-em-javascript/967093093/
  priceCointainer.innerText = parseFloat((totalPrice).toFixed(2));
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const itemID = event.target.classList[1];
  console.log(itemID);
  const itemUrl = `https://api.mercadolibre.com/items/${itemID}`;
  fetch(itemUrl, { method: 'GET' })
    .then((response) => response.json())
    .then((data) => calculatePrice(data.price, 'sub'));
  
  event.target.remove();
}

function emptyCart(event) {
  // reseta o preço para 0 
  const totalPriceReset = document.querySelector('.total-price');
  totalPriceReset.innerText = 0;
  // remove os items do cart
  const cartContainer = document.querySelector('.cart__items');
  while (cartContainer.firstChild) {
    cartContainer.removeChild(cartContainer.firstChild);
  }
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = `cart__item, ${sku}`;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
 
  return li;
}

async function addElementToCart(event) {
  const itemID = event.target.parentNode.firstChild.innerText;
  const itemUrl = `https://api.mercadolibre.com/items/${itemID}`;
  const cart = document.querySelector('.cart__items');
  fetch(itemUrl, { method: 'GET' })
  .then((response) => response.json())
  .then((data) => {
    const product = {
      sku: data.id,
      name: data.title,
      salePrice: data.price.toString(),
    };
    const item = createCartItemElement(product);
    cart.appendChild(item);
    calculatePrice(data.price, 'plus');
  })
  .catch(() => console.log('Error: invalid ID'));
}

function addEvents() {
  const buttons = document.querySelectorAll('.item__add');
  for (let i = 0; i < buttons.length; i += 1) {
    buttons[i].addEventListener('click', addElementToCart);
   }
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', emptyCart);
 }

function fetchMercadoLivreAPI() {
  const productSection = document.querySelector('.items');
  const init = {
    method: 'GET',
  };
  fetch(API_URL, init)
    .then((response) => response.json())
    .then((data) => {
      data.results.forEach((product) => {
        const productInfo = { sku: product.id, name: product.title, image: product.thumbnail };
        const element = createProductItemElement(productInfo);
        productSection.appendChild(element);
      });
      addEvents();
    })
    .catch(() => console.log('Error: failed to request'));
}

window.onload = () => { 
  fetchMercadoLivreAPI();
};
