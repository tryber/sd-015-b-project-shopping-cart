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

function apeendCartTotal(total) {
  const cartTotalElement = document.querySelector('div.total-price');
  cartTotalElement.innerText = `${total}`;
}

function calculateCartTotal() {
  const cartElement = document.querySelector('ol.cart__items');
  const cartItemsCollection = cartElement.children;
  const cartItemsList = [...cartItemsCollection];
  console.log(cartItemsList);
  const total = cartItemsList.reduce((acc, act) => {
    const texto = act.innerText;
    const priceIndex = texto.match(/(PRICE: \W)/).index + 8
    const price = Number(texto.slice(priceIndex));
    return acc + price;
  }, 0)
  apeendCartTotal(total);
}

function cartItemClickListener(event) {
  const element = event.target;
  element.remove();
  calculateCartTotal();
  saveCartOnLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  console.log(sku, name, salePrice);
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function saveCartOnLocalStorage() {
  const cart = document.querySelector('ol.cart__items');
  const cartHtml = cart.innerHTML;
  localStorage.setItem('cart', cartHtml)
}

function loadCartFromLocalStorage() {
  const savedCart = localStorage.getItem('cart');
  const actualCart = document.querySelector('ol.cart__items');
  actualCart.innerHTML = savedCart;
  const cartItemsCollection = actualCart.children;
  const cartItemsList = [...cartItemsCollection];
  cartItemsList.forEach((item) => item.addEventListener('click', cartItemClickListener));
}

async function getProductById(id) {
  const url = `https://api.mercadolibre.com/items/${id}`;
  const response = await fetch(url);
  const jsonResponse = await response.json();
  return jsonResponse;
}

async function getProductsList() {
  const query = 'computador';
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=$${query}`;
  const reponse = await fetch(url);
  const jsonResponse = await reponse.json();
  const resultsList = await jsonResponse.results; 
  return resultsList;
}

function addElementToParent(element, parentSelector) {
  const parentElment = document.querySelector(parentSelector);
  parentElment.appendChild(element);
}

async function appendProductList() {
  const productsList = await getProductsList();
  productsList.forEach((product) => {
    const { id, title, price } = product;
    const element = createProductItemElement({ sku: id, name: title, salePrice: price });
    addElementToParent(element, ('section.items'));
  });
}

function appendToCart(element) {
  const parent = document.querySelector('ol.cart__items');
  parent.appendChild(element);
  saveCartOnLocalStorage();
  calculateCartTotal();
}

async function addToCart(event) {
  const buttom = event.target;
  const idElement = buttom.parentNode.firstChild;
  const id = idElement.innerText;
  const product = await getProductById(id);
  const { title, price } = product;
  const cartItemElement = createCartItemElement({ sku: id, name: title, salePrice: price });
  cartItemElement.addEventListener('click', cartItemClickListener);
  appendToCart(cartItemElement);
}

function addEventListeners() {
  const addToCartButtomsColletction = document.getElementsByClassName('item__add');
  const addToCartButtomsList = [...addToCartButtomsColletction];
  addToCartButtomsList.forEach((buttom) => buttom.addEventListener('click', addToCart));
}

window.onload = async () => {
  await appendProductList();
  addEventListeners();
  loadCartFromLocalStorage();
  calculateCartTotal();
};
