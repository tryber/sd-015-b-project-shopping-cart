const items = document.querySelector('.items');
const userCart = document.querySelector('.cart__items');

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

async function getProductsArray() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  const computadores = await response.json();
  const { results } = computadores;
  return results;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

async function createProducts() {
  const products = await getProductsArray();
  products.forEach((product) => {
    items.appendChild(createProductItemElement(product));
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const el = event.target;
  el.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function saveProductsToLocalStorage({ id: sku, title: name, price: salePrice }) {
  const cartItems = JSON.parse(localStorage.getItem('userCart'));
  cartItems.push({ id: sku, title: name, price: salePrice });
  localStorage.setItem('userCart', JSON.stringify(cartItems));
}

function loadCartFromLocalStorage() {
  const cartStorage = JSON.parse(localStorage.getItem('userCart'));
  cartStorage.forEach((item) => {
    userCart.appendChild(createCartItemElement(item));
  });
}

function showAllCartPrice(product) {
  const products = JSON.parse(localStorage.getItem('userCart'));

}

items.addEventListener('click', (e) => {
  const el = e.target;
  if (el.classList.contains('item__add')) {
    const parent = el.parentElement;
    const id = getSkuFromProductItem(parent);
    fetch(`https://api.mercadolibre.com/items/${id}`)
      .then((response) => response.json())
      .then((product) => {
        userCart.appendChild(createCartItemElement(product));
        saveProductsToLocalStorage(product);
        showAllCartPrice();
      });
  }
});

function initializeStorage() {
  if (!localStorage.getItem('userCart')) {
    localStorage.setItem('userCart', JSON.stringify([]));
  }
}

window.onload = () => { 
  createProducts();
  initializeStorage();
  loadCartFromLocalStorage();
};
