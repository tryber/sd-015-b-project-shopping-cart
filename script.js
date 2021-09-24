const queryToList = 'ol.cart__items';
const queryToCartItem = 'li.cart__item';

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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
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

const updateCartOnStorage = () => {
  const actualCart = document.querySelector(queryToList);
  localStorage.setItem('cartList', actualCart.innerHTML);
};

const createLoading = () => {
  document.body.appendChild(createCustomElement('p', 'loading', 'Loading ...'));
};

const updateTotal = () => {
  const actualCart = document.querySelectorAll(queryToCartItem);
  const total = document.querySelector('span.total-price');

  const priceList = [];
  actualCart.forEach((item) => {
    priceList.push(parseFloat(item.innerText.split('$').reverse()[0], 10));
  });
  total.innerText = priceList.reduce((acc, actual) => acc + actual, 0);
};

function cartItemClickListener(event) {
  event.target.remove();
  updateTotal();
  updateCartOnStorage();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCart = (event) => {
  const id = getSkuFromProductItem(event.target.parentElement);
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((product) => {
      document.querySelector(queryToList)
        .appendChild(createCartItemElement(product));
      updateCartOnStorage();
      updateTotal();
    });
};

const addToCartListeners = () => document.querySelectorAll('.item__add')
  .forEach((btn) => btn.addEventListener('click', addToCart));

const fetchQuery = () => {
  createLoading();
  const query = 'computador';
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => response.json())
    .then((response) => {
      response.results.forEach((product) => {
        document.querySelector('section.items').appendChild(createProductItemElement(product));
      });
      addToCartListeners();
      document.querySelector('p.loading').remove();
    });
};

const loadCart = () => {
  const prevCart = document.querySelector(queryToList);
  prevCart.innerHTML = localStorage.getItem('cartList');
  document.querySelectorAll(queryToCartItem)
    .forEach((li) => li.addEventListener('click', cartItemClickListener));
  updateTotal();
};

const emptyCartBtn = () => {
  document.querySelector('button.empty-cart')
    .addEventListener('click', () => {
      document.querySelectorAll(queryToCartItem)
        .forEach((li) => li.remove());
      updateTotal();
    });
};

window.onload = () => {
  fetchQuery();
  loadCart();
  emptyCartBtn();
};
