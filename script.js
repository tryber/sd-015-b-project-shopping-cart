const urlML = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function requestFromML(api) {
  return fetch(api)
  .then((response) => response.json())
  .then((itemsInfo) => itemsInfo.results.forEach(({ id, title, thumbnail }) => {
    const ItemData = {
      sku: id,
      name: title,
      image: thumbnail,
    };
    const itemSection = document.querySelector('.items');
    const item = createProductItemElement(ItemData);
    itemSection.appendChild(item);
  })).catch(() => console
  .log('Não foi possível se conectar a API do Mercado Livre para criar os itens da página.'));
}

async function requestID(item) {
  const productID = getSkuFromProductItem(item);
  return fetch(`https://api.mercadolibre.com/items/${productID}`)
  .then((response) => response.json())
  .then(({ id, title, price }) => {
    const productData = {
      sku: id,
      name: title,
      salePrice: price,
    };
    const cartItems = document.querySelector('.cart__items');
    cartItems.appendChild(createCartItemElement(productData));
  });
}

function addToCart() {
  const items = document.querySelectorAll('.item');
  items.forEach((item) => item.lastChild.addEventListener('click', () => requestID(item)));
}

window.onload = () => { 
  requestFromML(urlML)
  .then(() => addToCart())
  .catch(() => console.log('Não foi possível adicionar o item ao carrinho.'));
};
