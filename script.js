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
function refreshTotalValue() {
  const productsIds = document.querySelectorAll('.cart__item');
  const totalDisplay = document.querySelector('.total-price');
  let totalSum = 0;
  productsIds.forEach((product) => {
    const productValue = parseFloat(product.getAttribute('price'));
    totalSum += productValue;
  });
  totalDisplay.innerText = totalSum;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
  refreshTotalValue();
}
function getAllCartItems() {
  const array = [];
  const list = document.querySelectorAll('.cart__item');
  list.forEach((element) => array.push(element.firstChild.parentElement.id));
  return array;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.id = sku;
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.setAttribute('price', salePrice);
  li.addEventListener('click', cartItemClickListener);
  const savedList = getAllCartItems();
  localStorage.setItem('items', savedList);
  return li;
}
async function addItemToCart(e) {
  const product = e.target.previousSibling.previousSibling.previousSibling;
  const productDetails = await fetch(`https://api.mercadolibre.com/items/${product.innerText}`)
  .then((item) => item.json());
  const { id, title, price } = productDetails;
  const cartList = document.querySelector('.cart__items');
  cartList.appendChild(createCartItemElement({ sku: id, name: title, salePrice: price }));
  createCartItemElement({ sku: id, name: title, salePrice: price });
  refreshTotalValue();
}
async function addItemToCart2(productID) {
  const productDetails = await fetch(`https://api.mercadolibre.com/items/${productID}`)
  .then((item) => item.json());
  const { id, title, price } = productDetails;
  const cartList = document.querySelector('.cart__items');
  cartList.appendChild(createCartItemElement({ sku: id, name: title, salePrice: price }));
  createCartItemElement({ sku: id, name: title, salePrice: price });
}
function loadAddButtons() {
  const addButton = document.querySelectorAll('.item__add');
  addButton.forEach((button) => button.addEventListener('click', addItemToCart));
}
async function getAPIElements() {
  const productList = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  const s = await productList.json();
  s.results.forEach((element) => {
    const { id, title, thumbnail } = element;
    document.body.appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail }));
  });
  loadAddButtons();
}
function loadCartList() {
  const savedItems = localStorage.getItem('items');
  if (savedItems === null) return; 
  savedItems.split(',').forEach((e) => { addItemToCart2(e); });
}
function emptyCart(){
  const cartList = document.querySelector('.cart__items');
  cartList.innerHTML = ''
}
function loadEmptyCart() {
  const emptyButton = document.querySelector('.empty-cart');
  emptyButton.addEventListener('click', emptyCart);
}


window.onload = () => {
  getAPIElements();
  loadCartList();
  loadAddButtons();
  loadEmptyCart();
};
