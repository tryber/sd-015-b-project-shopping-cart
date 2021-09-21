const queryToList = 'ol.cart__items';

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

const updateCart = () => {
  const actualCart = document.querySelector(queryToList);
  localStorage.setItem('cartList', actualCart.innerHTML);
};

function cartItemClickListener(event) {
  event.target.remove();
  updateCart();
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
      updateCart();
    });
};

const addToCartListeners = () => document.querySelectorAll('.item__add')
  .forEach((btn) => btn.addEventListener('click', addToCart));

const fetchQuery = () => {
  const query = 'computador';
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => response.json())
    .then((response) => {
      response.results.forEach((product) => {
        document.querySelector('section.items').appendChild(createProductItemElement(product));
      });
      addToCartListeners();
    });
};

const loadCart = () => {
  const prevCart = document.querySelector(queryToList);
  prevCart.innerHTML = localStorage.getItem('cartList');
  document.querySelectorAll('li.cart__item')
    .forEach((li) => li.addEventListener('click', cartItemClickListener));
};

window.onload = () => {
  fetchQuery();
  loadCart();
};
