function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const setCartItensOnLocalStorage = (list) => {
  localStorage.setItem('cartItens', list.innerHTML);
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerHTML;
}

function cartItemClickListener(event) {
  event.target.remove();
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
  })
  .then(() => {
    const cartItens = document.querySelector('.cart__items');
    setCartItensOnLocalStorage(cartItens);
  });
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  e.addEventListener('click', (event) => getProductID(event));
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
  const API_URL = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
  fetch(API_URL)
  .then((response) => response.json())
  .then((data) => {
    const products = data.results;
    products.forEach((productItem) => {
      const item = createProductItemElement(productItem);
      document.querySelector('.items').appendChild(item);
    });
  })
  .catch(() => alert('Error - Product is not found!'));
};

const getElementsFromLocalStorage = () => {
  const cartItens = document.getElementsByClassName('cart__items')[0];
  const cartListItens = localStorage.getItem('cartItens');
  if (cartListItens) {
    cartItens.innerHTML = cartListItens;
    const items = document.querySelectorAll('.cart__item');
    items.forEach((item) => {
      item.addEventListener('click', cartItemClickListener);
    });
  }
};

window.onload = () => { 
  getProductsFromAPI();
  getElementsFromLocalStorage();
};
