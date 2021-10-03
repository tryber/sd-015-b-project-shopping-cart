const cartItemsOl = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');

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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }
function emptyCart() {
  totalPrice.innerText = 0;
  localStorage.clear();
  cartItemsOl.innerHTML = '';
}

function emptyCartEventListener() {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', emptyCart);
}

function saveCartItems(key, keyValue) {
  localStorage.setItem(key, keyValue);
}

function totalPriceSum(price) {
  totalPrice.innerText = Math.round((Number(totalPrice.innerText) + Number(price)) * 100) / 100;
  saveCartItems('totalPrice', totalPrice.innerText);
}

function cartItemClickListener(event) {
  totalPriceSum(`-${event.target.innerHTML.split('$')[1]}`);
  event.target.remove();
  saveCartItems('list', cartItemsOl.innerHTML);
  // saveCartItems('totalPrice', totalPrice.innerText);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addItemtoCart(item) {
  fetch(`https://api.mercadolibre.com/items/${item}`)
  .then((response) => response.json())
  .then(({ id, title, price }) => {
    const itemInfo = {
      sku: id,
      name: title,
      salePrice: price,
    };
    const cartList = document.querySelector('.cart__items');
    cartList.appendChild(createCartItemElement(itemInfo));
    totalPriceSum(price);
    saveCartItems('list', cartItemsOl.innerHTML);
    saveCartItems('totalPrice', totalPrice.innerText);
  });
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const addBttn = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(addBttn);
  addBttn.addEventListener('click', () => addItemtoCart(sku));
  cartItemsOl.addEventListener('click', cartItemClickListener);
  return section;
}

function createObjectProduct(dados) {
  const itemDiv = document.querySelector('.items');
  dados.forEach((dado) => {
    const item = createProductItemElement(dado);
    itemDiv.appendChild(item);
  });
  document.querySelector('.loading').remove();
}

function loadingMessage() {
  document.body.appendChild(createCustomElement('p', 'loading', 'Loading...'));
}

function getApi() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((dados) => dados.results)
  .then((results) => createObjectProduct(results));
}

window.onload = () => {
  getApi();
  loadingMessage();
  emptyCartEventListener();
  if (localStorage.getItem('list')) {
      cartItemsOl.innerHTML = localStorage.getItem('list');
      totalPriceSum(localStorage.getItem('totalPrice'));
  }
};