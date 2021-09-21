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

async function getInfos(url) {
  const urlData = url;
  const response = await fetch(urlData);
  const jsonData = await response.json();
  return jsonData;
}

// Função entendida e desenvolvida com base no código do Gabriel Benedicto
// https://github.com/tryber/sd-015-b-project-shopping-cart/blob/b5ae9470633f2967668fb997ca6164fadc616929/script.js#L97
function saveOnLocalStorage() {
  const itemsOnLocalStorage = [];

  const listItems = document.querySelectorAll('.cart__item');

  listItems.forEach((element) => itemsOnLocalStorage.push(element.innerText));

  localStorage.setItem('currentCart', JSON.stringify(itemsOnLocalStorage));
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

function getOldCart() {
  const olList = document.querySelector('.cart__items');

  if (localStorage.getItem('currentCart')) {
    const items = JSON.parse(localStorage.getItem('currentCart'));

    items.forEach((item) => {
      const li = document.createElement('li');
      li.innerHTML = item;
      li.className = 'cart__item';
      li.addEventListener('click', cartItemClickListener);
      olList.appendChild(li);
    });
  }
}

async function getItemInfos(item) {
  const productId = getSkuFromProductItem(item);
  const url = `https://api.mercadolibre.com/items/${productId}`;
  const endPointInfos = await getInfos(url);
  const response = endPointInfos;
  const cartItems = document.querySelector('.cart__items');

  cartItems.appendChild(createCartItemElement({
    sku: response.id, name: response.title, salePrice: response.price,
  }));
  saveOnLocalStorage();
}

async function addItemToCart() {
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
  addItemToCart();
  return result;
}

window.onload = () => {
  getItemsElement();
  getOldCart();
};
