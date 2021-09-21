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

function handlePrice(itemPrice, operation) {
  const counter = document.querySelector('.total-price');
  let price = 0;
  if (operation === '+') {
    price = parseFloat(counter.innerText) + parseFloat(itemPrice);
  } 
  if (operation === '-') {
    price = parseFloat(counter.innerText) - parseFloat(itemPrice);
  }
  counter.innerText = price;
}

function cartItemClickListener(event) {
  const cartItem = event.target;

  const itemsText = cartItem.innerText;
  const itemsData = itemsText.split('|');
  const sku = itemsData[0].split(' ')[1];

  const salePrice = itemsData[2].slice(9);
  handlePrice(salePrice, '-');

  const cart = cartItem.parentElement;
  cart.removeChild(cartItem);

  localStorage.removeItem(`${sku}`);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addItemToCart(data) {
  const cartList = document.getElementsByClassName('cart__items')[0];
  const itemData = { sku: data.id, name: data.title, salePrice: data.price };
  cartList.appendChild(createCartItemElement(itemData));

  handlePrice(data.price, '+');

  localStorage.setItem(`${itemData.sku}`, JSON.stringify(itemData));
}

async function getProductByIdFromEndpoint(event) {
  const button = event.target;
  const itemId = await getSkuFromProductItem(button.parentElement);

  const response = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const data = await response.json();

  addItemToCart(data);
}

async function handleItemsListButtonEventAdd() {
  const itemsListButtons = document.querySelectorAll('.item__add');
  itemsListButtons.forEach((button) => {
    button.addEventListener('click', getProductByIdFromEndpoint);
  });
}

function handleCartListErasing() {
  const counter = document.querySelector('.total-price');
  const cart = document.querySelector('.cart__items');
  while (cart.firstChild) {
    cart.removeChild(cart.firstChild);
  }
  counter.innerText = 0;
  localStorage.clear();
}

async function eraseButtonListener() {
  const eraseButton = document.querySelector('.empty-cart');
  eraseButton.addEventListener('click', handleCartListErasing);
}

async function getProductsFromEndpoint() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const data = await response.json();
  await data.results.forEach((itemOnSale) => {
    const item = document.querySelector('.items');
    item.appendChild(createProductItemElement(
      { sku: itemOnSale.id, name: itemOnSale.title, image: itemOnSale.thumbnail },
    ));
  });
  await handleItemsListButtonEventAdd();
  await eraseButtonListener();
}

function retrieveListFromLocalStorage() {
  const items = localStorage.length;
  const cartList = document.querySelector('.cart__items');
  for (let index = 0; index < items; index += 1) {
    const key = localStorage.key(index);
    const item = JSON.parse(localStorage.getItem(key));
    const itemData = { sku: item.sku, name: item.name, salePrice: item.salePrice };
    cartList.appendChild(createCartItemElement(itemData));
    handlePrice(item.salePrice, '+');
  }
}

window.onload = () => {
  getProductsFromEndpoint();
  if (localStorage.length > 0) {
    retrieveListFromLocalStorage();
  }
};
