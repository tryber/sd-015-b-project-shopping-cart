function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const createTotalPrice = () => {
  const totalPrice = document.querySelector('.total-price');
  const getCartLi = document.querySelectorAll('.cart__item');
  let sum = 0;
  getCartLi.forEach((element) => {
    sum += parseFloat(element.getAttribute('price'));
    console.log(sum);
    return sum;
  });
  totalPrice.innerText = sum;
};

function cartItemClickListener(event) {
  // coloque seu código aqui
  const item = event.target;
  item.remove();
  const olCartRemoved = document.querySelector('ol');
  localStorage.setItem('olCartElements', olCartRemoved.innerHTML);
  createTotalPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.setAttribute('price', salePrice);
  li.addEventListener('click', cartItemClickListener);
  createTotalPrice();
  return li;
}

const addToCart = (event) => {
  const clickedButton = event.target;
  const section = clickedButton.parentNode;
  const skuId = section.firstChild;
  fetch(`https://api.mercadolibre.com/items/${skuId.innerText}`)
  .then((res) => res.json())
  .then(({ id, title, price }) => {
    const cartItems = {
      sku: id,
      name: title,
      salePrice: price,
    };
    const olCart = document.querySelector('.cart__items');
    olCart.appendChild(createCartItemElement(cartItems));
    createTotalPrice();
    const appendOl = olCart.innerHTML;
    localStorage.setItem('olCartElements', appendOl);
  });
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', addToCart);
  }
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

const pageInit = () => {
  const cartPageInit = localStorage.getItem('olCartElements');
  const olCartItems = document.querySelector('.cart__items');
  olCartItems.innerHTML = cartPageInit;
  const lis = document.querySelectorAll('.cart__item');
  lis.forEach((el) => el.addEventListener('click', cartItemClickListener));
};

const createTotalValueArea = () => {
  const secTotalPrice = document.createElement('section');
  secTotalPrice.className = 'total-price';
  const cartSec = document.querySelector('.cart');
  cartSec.appendChild(secTotalPrice);
};

const emptyAllCart = () => {
  const btnEmpty = document.querySelector('.empty-cart');
  return btnEmpty.addEventListener('click', (event) => {
    const olEmpty = event.target.nextElementSibling;
    olEmpty.innerHTML = '';
    createTotalPrice();
    localStorage.setItem('olCartElements', olEmpty.innerHTML);
  });
};

const createLoading = () => {
  const apiItems = document.querySelector('.items');
  const loading = document.createElement('h2');
  const body = document.querySelector('body');
  apiItems.style.display = 'none';
  loading.innerText = 'Loading...';
  loading.className = 'loading';
  body.appendChild(loading);
};

const resetPage = () => {
  const apiItems = document.querySelector('.items');
  const load = document.querySelector('.loading');
  load.remove();
  apiItems.style.display = 'flex';
};

const createItemsList = async () => {
  createLoading();
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  try {
    const data = await fetch(url);
    const { results } = await data.json();
    results.forEach(({ id, title, thumbnail }) => {
      const objItems = { sku: id, name: title, image: thumbnail };
      const sectionItems = document.querySelector('.items');
      const itemCreate = createProductItemElement(objItems);
      sectionItems.appendChild(itemCreate);
    });
  } catch (error) {
    console.log('Requisition failed');
    console.log(error);
  }
  resetPage();
};

window.onload = () => {
  createItemsList();
  pageInit();
  createTotalValueArea();
  emptyAllCart();
  createTotalPrice();
};
