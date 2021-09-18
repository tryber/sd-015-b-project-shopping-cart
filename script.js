const items = document.querySelector('.items');
const userCart = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');
const emptyCartBtn = document.querySelector('.empty-cart');
const loading = document.querySelector('.loading');

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

function createProductItemElement({ id: sku, title: name }, image) {
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
   fetch(`https://api.mercadolibre.com/items/${product.id}`)
    .then((response) => response.json())
    .then((item) => item.pictures[0])
    .then(({ url }) => url)
    .then((imageUrl) => items.appendChild(createProductItemElement(product, imageUrl)));
  });
  loading.remove();
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function removeProductsFromLocalStorage(index) {
  const productStorage = JSON.parse(localStorage.getItem('userCart'));
  if (!productStorage) return;
  // console.log(productStorage);
  const newStorage = [];
  let bol = true;
  productStorage.forEach((item, i) => {
    if (i === index && bol) {
      bol = false;
    } else {
      newStorage.push(item);
    }
  });
  localStorage.setItem('userCart', JSON.stringify(newStorage));
}

function subtractPrice(index) {
  const productStorage = JSON.parse(localStorage.getItem('userCart'));
  const product = productStorage.find((_, i) => i === index);
  const { price } = product; 
  totalPrice.innerHTML = (Number(totalPrice.innerHTML) - price).toFixed(2);
  localStorage.setItem('totalPrice', JSON.stringify(totalPrice.innerHTML));
}

function getProductIndexToRemove(cartArr) {
  let index;
  cartArr.forEach((product, i) => {
    if (product.classList.contains('toRemove')) index = i;
  });
  return index;
}

function cartItemClickListener(event) {
  const el = event.target;
  el.classList.add('toRemove');
  const cartArr = Array.from(userCart.children);
  const productIndex = getProductIndexToRemove(cartArr);
  subtractPrice(productIndex);
  removeProductsFromLocalStorage(productIndex);
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

function savePriceToLocalStorage() {
    const total = Number(totalPrice.innerHTML);
    localStorage.setItem('totalPrice', JSON.stringify(total));
}

function updatePrice({ price }) {
  let total = 0;
  if (totalPrice.innerHTML) total += Number(totalPrice.innerHTML);
  total += price;
  totalPrice.innerHTML = total.toFixed(2);
}

function loadPrice() {
  const price = JSON.parse(localStorage.getItem('totalPrice'));
  totalPrice.innerHTML = price;
}

emptyCartBtn.addEventListener('click', () => {
  userCart.innerHTML = '';
  localStorage.setItem('userCart', '');
  totalPrice.innerHTML = 0;
  localStorage.setItem('totalPrice', JSON.stringify(0));
});

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
        updatePrice(product);
        savePriceToLocalStorage();
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
  loadPrice();
};
