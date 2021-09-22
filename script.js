const total = Number(localStorage.getItem('totalPrice'));
let totalPrice = ((total > 0) ? total : 0);
const buttonEmpytCart = document.querySelector('.empty-cart');
const arrayLocalStorage = JSON.parse(localStorage.getItem('cartItems'));
const arrayToLocalStorage = ((arrayLocalStorage === true) ? arrayLocalStorage : []);

const clearAllCart = () => {
  localStorage.clear();
  document.getElementsByClassName('cart__items')[0].innerHTML = '';
  document.querySelector('.total-price').innerHTML = 0;
};

buttonEmpytCart.addEventListener('click', clearAllCart);

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const setCartItensOnLocalStorage = (array) => {
  localStorage.setItem('cartItems', JSON.stringify(array));
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerHTML;
}

const setTotalInLocalStorage = (price) => {
  localStorage.setItem('totalPrice', price);
};

const incrementPrice = (price) => {
  const elementTotal = document.getElementsByClassName('total-price')[0];
  totalPrice += price;
  elementTotal.innerText = Number(totalPrice.toFixed(2));
  setTotalInLocalStorage(Number(totalPrice.toFixed(2)));
};

const decrementPrice = (price) => {
  const elementTotal = document.getElementsByClassName('total-price')[0];
  if (totalPrice > 0) {
    totalPrice -= price;
    elementTotal.innerText = Number(totalPrice.toFixed(2));
    setTotalInLocalStorage(Number(totalPrice.toFixed(2)));
  }
};

const getPriceToIncrement = (event) => {
  const itemId = getSkuFromProductItem(event.target.parentElement);
  fetch(`https://api.mercadolibre.com/items/${itemId}`)
  .then((response) => response.json())
  .then((product) => {
    incrementPrice(product.price);
  });
};

const getPriceToDecrement = (event) => {
  const itemId = event.target.innerText.substring(5, 18);
  fetch(`https://api.mercadolibre.com/items/${itemId}`)
  .then((response) => response.json())
  .then((product) => {
    decrementPrice(product.price);
  });
};

function cartItemClickListener(event) {
  event.target.remove();
  getPriceToDecrement(event);
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getProductID = (event) => {
  const itemId = getSkuFromProductItem(event.target.parentElement);
  fetch(`https://api.mercadolibre.com/items/${itemId}`)
  .then((response) => response.json())
  .then((product) => {
    const cartItem = createCartItemElement(product);
    document.querySelector('.cart__items').appendChild(cartItem);
    return product;
  })
  .then((product) => {
    arrayToLocalStorage.push(createCartItemElement(product).innerText);
    setCartItensOnLocalStorage(arrayToLocalStorage);
  });
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', (event) => {
      getProductID(event);
      getPriceToIncrement(event);
    });
  }
  return e;
}

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const getProductsFromAPI = (product = 'computador') => {
  const loading = createCustomElement('p', 'loading', 'carregando...');
  const section = document.querySelector('.items');
  section.appendChild(loading);
  const API_URL = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
  fetch(API_URL)
  .then((response) => response.json())
  .then((data) => {
    section.removeChild(loading);
    const products = data.results;
    products.forEach((productItem) => {
      const item = createProductItemElement(productItem);
      section.appendChild(item);
    });
  })
  .catch(() => alert('Error - Product is not found!'));
};

const getElementsFromLocalStorage = () => {
  const cartItens = document.querySelector('.cart__items');
  const cartItems = JSON.parse(localStorage.getItem('cartItems'));
  if (cartItems) {
    cartItems.forEach((item) => {
      const splitProduct = item.split('|');
      const id = splitProduct[0].slice(5, splitProduct[0].length - 1);
      const title = splitProduct[1].slice(7, splitProduct[1].length - 1);
      const price = splitProduct[2].slice(9, splitProduct[2].length);
      console.log(price);
      const objProduct = { id, title, price };
      const li = createCartItemElement(objProduct);
      cartItens.appendChild(li);
    });
  }
};

const getTotalInLocalStorage = () => {
  const elementTotal = document.querySelector('.total-price');
  elementTotal.innerHTML = totalPrice;
};

window.onload = () => { 
  getProductsFromAPI();
  getElementsFromLocalStorage();
  getTotalInLocalStorage();
};
