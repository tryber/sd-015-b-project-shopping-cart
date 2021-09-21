const ol = '.cart__items';
const cartItems = '.cart__item';

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

function showLoading() {
  const h2Loading = document.createElement('h2');
  const body = document.querySelector('body');
  h2Loading.className = 'loading';
  h2Loading.innerHTML = 'loading...';
  body.appendChild(h2Loading);
}

function hiddenLoading() {
  document.querySelector('.loading').remove();
}

function clear() {
  const olItems = document.querySelectorAll(cartItems);

  olItems.forEach((li) => li.remove());
}

function clearCart() {
  const clearButton = document.querySelector('.empty-cart');

  clearButton.addEventListener('click', clear);
}

async function getInfos(url) {
  const urlData = url;
  const response = await fetch(urlData);
  const jsonData = await response.json();
  return jsonData;
}

// Função entendida e desenvolvida com base no código do Paulo Flora
// https://github.com/tryber/sd-015-b-project-shopping-cart/blob/paulo-flora-shopping-cart-project/script.js
function sumPrice() {
  const totalPrice = document.querySelector('.total-price');
  const listItems = document.querySelectorAll(cartItems);
  let total = 0;
  
  listItems.forEach(async (item) => {
    const productId = item.innerText.split(' ')[1];
    const url = `https://api.mercadolibre.com/items/${productId}`;
    const endPointInfos = await getInfos(url);
    const { price } = endPointInfos;
    total += price; 
    totalPrice.innerHTML = total;
  });
}

// Função entendida e desenvolvida com base no código do Gabriel Benedicto
// https://github.com/tryber/sd-015-b-project-shopping-cart/blob/b5ae9470633f2967668fb997ca6164fadc616929/script.js#L97
function saveOnLocalStorage() {
  const itemsOnLocalStorage = [];

  const listItems = document.querySelectorAll('.cart__item');

  listItems.forEach((item) => itemsOnLocalStorage.push(item.innerText));

  localStorage.setItem('currentCart', JSON.stringify(itemsOnLocalStorage));
  sumPrice();
}

function cartItemClickListener(event) { 
  event.target.remove();
  saveOnLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Função entendida e desenvolvida com base no código do Gabriel Benedicto
// https://github.com/tryber/sd-015-b-project-shopping-cart/blob/b5ae9470633f2967668fb997ca6164fadc616929/script.js#L97
function getOldCart() {
  const olList = document.querySelector(ol);

  if (localStorage.getItem('currentCart')) {
    const items = JSON.parse(localStorage.getItem('currentCart'));

    items.forEach((item) => {
      const li = document.createElement('li');
      li.innerHTML = item;
      li.className = 'cart__item';
      li.addEventListener('click', cartItemClickListener);
      olList.appendChild(li);
      sumPrice();
    });
  }
}

async function getItemInfos(item) {
  const productId = getSkuFromProductItem(item);
  const url = `https://api.mercadolibre.com/items/${productId}`;
  const endPointInfos = await getInfos(url);
  const response = endPointInfos;
  const itemsOnCart = document.querySelector(ol);

  itemsOnCart.appendChild(createCartItemElement({
    sku: response.id, name: response.title, salePrice: response.price,
  }));
  saveOnLocalStorage();
}

function addItemToCart() {
  const items = document.querySelectorAll('.item');
  
  items.forEach((item) => item.lastChild.addEventListener('click', () => {
    getItemInfos(item);
    saveOnLocalStorage();
  }));
}

async function getItemsElement() {
  const endPointInfos = await getInfos(
    'https://api.mercadolibre.com/sites/MLB/search?q=$computador',
  );
  const productResults = endPointInfos.results;
  const sectionItems = document.querySelector('.items');
  const result = productResults.forEach((product) => {
    const productId = product.id;
    const productName = product.title;
    const productImageId = product.thumbnail_id;
    const productImage = `https://http2.mlstatic.com/D_NQ_NP_${productImageId}-O.webp`;

    sectionItems.appendChild(
      createProductItemElement({ sku: productId, name: productName, image: productImage }),
    );
  });
  hiddenLoading();
  addItemToCart();
  return result;
}

window.onload = () => {
  showLoading();
  getItemsElement();
  getOldCart();
  sumPrice();
  clearCart();
};
