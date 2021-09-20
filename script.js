function getTotalPrice() {
  const totalPrice = document.querySelector('.total-price');
  return totalPrice;
}

function getCartItems() {
  const cartList = document.querySelector('.cart__items');
  return cartList;
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

async function requestComputador() {
  const API_ML = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const data = await fetch(API_ML);
  const result = await data.json();
  
  return result;
}

function addProducts(products) {
  const section = document.querySelector('.items');
  products.results.forEach(({ id, title, thumbnail }) => {
    const createProduct = createProductItemElement({ sku: id, name: title, image: thumbnail });
    section.appendChild(createProduct);
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function saveCart() {
  const cartList = getCartItems();
  const carts = cartList.innerHTML;
  const translateCarts = JSON.stringify(carts);
  localStorage.setItem('cart', translateCarts);
}

function cartItemClickListener(event) {
  event.target.remove();
  saveCart();
}

function remakeCart(cart) {
  const carts = cart;
  const actualCart = JSON.parse(localStorage.getItem('cart'));
  carts.innerHTML = actualCart;
  carts.addEventListener('click', cartItemClickListener);
}
async function cartItemClickListenerPrice(event) {
  const totalPrice = getTotalPrice();
  const textProduct = event.target.innerText;
  const idProduct = textProduct.substr(5, 13);
  const totalValue = parseFloat(totalPrice.innerText);
  async function fetchId() {
    const API_ID = `https://api.mercadolibre.com/items/${idProduct}`;
    const data = await fetch(API_ID);
    const computer = await data.json();
    const { price } = computer;
    return price;
  }
  totalPrice.innerText = totalValue - await fetchId();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  li.addEventListener('click', cartItemClickListenerPrice);
  
  return li;
}

async function addIdComputer(actualId) {
  const totalPrice = getTotalPrice();
  const idComputer = getSkuFromProductItem(actualId);
  const API_ID = `https://api.mercadolibre.com/items/${idComputer}`;
  const data = await fetch(API_ID);
  const computer = await data.json();
  const { id, title, price } = computer;
  
  const teste = parseFloat(totalPrice.innerText);
  totalPrice.innerText = teste + price;

  const dataComputer = {
    sku: id,
    name: title,
    salePrice: price,
  };
  const olCart = getCartItems();
  olCart.appendChild(createCartItemElement(dataComputer));
  saveCart();
}

function addCartEventButtons() {
  const items = document.querySelectorAll('.item');
  items.forEach((item) => item.lastChild.addEventListener('click', (() => {
    addIdComputer(item);
  })));
}

function resetCart() {
  const totalPrice = getTotalPrice();
  const fatherCarts = getCartItems();
  const childCarts = document.querySelectorAll('.cart__item');

  childCarts.forEach((element) => {
    fatherCarts.removeChild(element);
  });
  totalPrice.innerText = 0;
}

function addEventButtonReset() {
  const buttonResetCart = document.querySelector('.empty-cart');
  buttonResetCart.addEventListener('click', resetCart);
}
async function allFunctionsCalled() {
  try {
    const product = await requestComputador();
    addProducts(product);
    const cartList = document.querySelector('.cart__items');
    remakeCart(cartList);
    addCartEventButtons();
    addEventButtonReset();
  } catch (error) {
    throw new Error(error);
  }
}

window.onload = () => {
  allFunctionsCalled();
 };
