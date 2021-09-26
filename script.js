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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function calculatePrice(price, type) {
  const priceTotal2 = document.querySelector('.total-price');
  if (type === 'plus') { totalPrice += price; }
  if (type === 'sub') { totalPrice -= price; }
  priceTotal2.innerText = parseFloat((totalPrice).toFixed(2));
}

function cartItemClickListener(event) {
  const itemId = event.target.classList[1];
  const itemUrl = `https://api.mercadolibre.com/items/${itemId}`;
  fetch(itemUrl, { method: 'GET' })
    .then((response) => response.json())
    .then((data) => calculatePrice(data.price, 'sub'));
  event.target.remove();
}

function esvaziarCarrinho() {
  const preçoResetado = document.querySelector('.total-price');
  preçoResetado.innerText = 0;
  const dentroCarrinho = document.querySelector('.cart__items');
  while (dentroCarrinho.firstChild) {
    dentroCarrinho.removeChild(dentroCarrinho.firstChild);
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
    console.log(item);
    cart.appendChild(item);
    calculatePrice(data.price, 'plus');
  })
  .catch(() => console.log('Error: invalid ID'));
}

function addEvents() {
  const buttons = document.querySelectorAll('.item__add');
  for (let i = 0; i < buttons.length; i += 1) {
    buttons[i] = document.addEventListener('click', addElementToCart);
   }
   const limparBotão = document.querySelector('.empty-cart');
   limparBotão.addEventListener('click', esvaziarCarrinho);
 }

function fetchAPI() {
  const produto = document.querySelector('.items');
  const init = {
    method: 'GET',
  };
  fetch(API_URL, init)
    .then((response) => response.json())
    .then((data) => {
      data.results.forEach((product) => {
        const element = createProductItemElement(product);
        console.log(element);
        produto.appendChild(element);
      });
      addEvents();
    })
    .catch(() => console.log('Error: failed to request'));
}

window.onload = () => { 
  fetchAPI();
};
