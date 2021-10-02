const MLBurl = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
const recordedDataCart = localStorage.getItem('cartActual');

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

function cartSave() {
  const cartItems = [...document.querySelectorAll('.cart__item')];
  const auxLocalStorage = [];

  cartItems.forEach((item) => {
    auxLocalStorage.push(item.innerHTML);
  });

  localStorage.setItem('cartActual', JSON.stringify(auxLocalStorage));
}

function calculePrice() {
  const cartItems = [...document.querySelectorAll('.cart__item')];
  const actualAmount = document.querySelector('.total-price');

  const ValuesPrice = cartItems.map((item) => {
    const valueStr = item.innerText.split('$').reverse()[0];
    const valueNum = parseFloat(valueStr, 10);
    return valueNum;
  });

  const totalPrice = ValuesPrice.reduce((total, current) => (total + current), 0);
  actualAmount.innerText = `${totalPrice}`;
}

function cartItemClickListener(event) {
  event.target.remove();
  calculePrice();
  cartSave();
}

function restoreLiCart(itemsLocal) {
  const cartList = document.querySelector('.cart__items');
  itemsLocal.forEach((item) => {
    const row = document.createElement('li');
    row.innerHTML = item;
    row.classList.add('cart__item');
    row.addEventListener('click', cartItemClickListener);
    cartList.appendChild(row);
  });
}

function restoreCartSave() {
  const cartAnterior = JSON.parse(localStorage.getItem('cartActual'));
  restoreLiCart(cartAnterior);
}

function createCardItemElement({ id, title, price }) {
  const row = document.createElement('li');
  row.classList = 'cart__item';
  row.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  row.addEventListener('click', cartItemClickListener);
  return row;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createList(data) {
  const list = document.querySelector('.cart__items');
  list.appendChild(data);
  cartSave();
  calculePrice();
}

async function searchIdInResult(element) {
  const IDrequest = getSkuFromProductItem(element.path[1]);
  return fetch(`https://api.mercadolibre.com/items/${IDrequest}`)
    .then((response) => response.json())
    .then(({ id, title, price }) => {
      createList(createCardItemElement({ id, title, price }));  
  });
}

function addListenerButton() { 
  const items = document.querySelectorAll('.item');
  Object.keys(items).forEach((item) => {
    items[item].addEventListener('click', searchIdInResult);
  });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.addEventListener('click', addListenerButton);
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

function getElementsItems(result) {
  const sectionItems = document.querySelector('.items');
  const itemElement = createProductItemElement(result);
  sectionItems.append(itemElement);
}

async function getRequest(url) {
  return fetch(url)
    .then((response) => response.json())
    .then((listSearch) => listSearch.results.forEach(({ id, title, thumbnail }) => {
      const objCartMod = { sku: id, name: title, image: thumbnail };
      getElementsItems(objCartMod); 
    }));
}

function order() {
  getRequest(MLBurl)
    .then(() => addListenerButton())
    .then(() => calculePrice());
}

window.onload = () => {
  if (recordedDataCart) restoreCartSave();
  order();
};
