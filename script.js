const cartElement = document.querySelector('ol.cart__items');

function addElementToParent(element, parentSelector) {
  const parentElment = document.querySelector(parentSelector);
  parentElment.appendChild(element);
}

function appendLoadingElement() {
  const loadingElement = document.createElement('p');
  loadingElement.className = 'loading';
  loadingElement.innerText = 'Loading...';
  addElementToParent(loadingElement, 'section.items');
}

function removeLoadingElement() {
  const loadingElement = document.querySelector('.loading');
  loadingElement.remove();
}

function saveCartOnLocalStorage() {
  const cartHtml = cartElement.innerHTML;
  localStorage.setItem('cart', cartHtml);
}

function apeendCartTotal(total) {
  const cartTotalElement = document.querySelector('div.total-price');
  cartTotalElement.innerText = `${total}`;
}

function calculateCartTotal() {
  const cartItemsCollection = cartElement.children;
  const cartItemsList = [...cartItemsCollection];
  const total = cartItemsList.reduce((acc, act) => {
    const texto = act.innerText;
    const priceIndex = texto.match(/(PRICE: \W)/).index + 8;
    const price = Number(texto.slice(priceIndex));
    return acc + price;
  }, 0);
  apeendCartTotal(total);
}

function cartItemClickListener(event) {
  const element = event.target;
  element.remove();
  calculateCartTotal();
  saveCartOnLocalStorage();
}

function loadCartFromLocalStorage() {
  const savedCart = localStorage.getItem('cart');
  cartElement.innerHTML = savedCart;
  const cartItemsCollection = cartElement.children;
  const cartItemsList = [...cartItemsCollection];
  cartItemsList.forEach((item) => item.addEventListener('click', cartItemClickListener));
}

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

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
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

async function appendProductList() {
  const productsList = await getProductsList();
  productsList.forEach((product) => {
    const { id, title, thumbnail } = product;
    const element = createProductItemElement({ sku: id, name: title, image: thumbnail });
    addElementToParent(element, ('section.items'));
  });
  removeLoadingElement();
}

async function addToCart(event) {
  const buttom = event.target;
  const idElement = buttom.parentNode.firstChild;
  const id = idElement.innerText;
  const product = await getProductById(id);
  const { title, price } = product;
  const cartItemElement = createCartItemElement({ sku: id, name: title, salePrice: price });
  cartItemElement.addEventListener('click', cartItemClickListener);
  addElementToParent(cartItemElement, 'ol.cart__items');
  saveCartOnLocalStorage();
  calculateCartTotal();
}

function emptyCart() {
  cartElement.innerHTML = '';
  localStorage.removeItem('cart');
  calculateCartTotal();
}

function addEventListeners() {
  const addToCartButtomsColletction = document.getElementsByClassName('item__add');
  const addToCartButtomsList = [...addToCartButtomsColletction];
  addToCartButtomsList.forEach((buttom) => buttom.addEventListener('click', addToCart));
  const emptyCartButtom = document.querySelector('.empty-cart');
  emptyCartButtom.addEventListener('click', emptyCart);
}

window.onload = async () => {
  appendLoadingElement();
  await appendProductList();
  addEventListeners();
  loadCartFromLocalStorage();
  calculateCartTotal();
};
