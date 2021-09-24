const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
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

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
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
  })
  .catch(() => console.log('Error: invalid ID'));
}

function addEvents() {
  const buttons = document.querySelectorAll('.item__add');
  for (let i = 0; i < buttons.length; i += 1) {
    buttons[i] = document.addEventListener('click', addElementToCart);
   }
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
