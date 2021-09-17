const getCartItems = document.querySelector('.cart__items');
const btnEmptyCart = document.querySelector('.empty-cart');
const getTotalPriceContainer = document.querySelector('.total-price');

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

function sumTotalPrice() {
  const result = Array.from(document.querySelectorAll('.cart__item'))
    .reduce((acc, currentItem) => {
      let sum = acc;
      sum += Number(((currentItem.innerText.split(':'))[3]).trim().slice(1));
      return sum;
    }, 0);
  let total = document.querySelector('.total-price p');
  if (total === null) {
    total = document.createElement('p');
  }
  total.innerText = result;
  getTotalPriceContainer.appendChild(total);
}

function updateLocalStorage() {
  const currentCart = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cartItems', currentCart);
}

function cartItemClickListener(event) {
  event.target.remove();
  updateLocalStorage();
  sumTotalPrice();
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addItemToCart() {
  const sku = getSkuFromProductItem(this.parentElement);
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then((response) => response.json())
    .then(({ id, title, price }) => {
      const item = { sku: id, name: title, salePrice: price };
      const cartItem = createCartItemElement(item);
      getCartItems.appendChild(cartItem);
      updateLocalStorage();
      sumTotalPrice();
    });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const btnAddToCart = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  btnAddToCart.addEventListener('click', addItemToCart);
  section.appendChild(btnAddToCart);

  return section;
}

const fetchProduct = (product) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`)
    .then((response) => response.json())
    .then((productsList) => productsList.results
      .forEach(({ id, title, thumbnail }) => {
        const productItem = { sku: id, name: title, image: thumbnail };
        const itemSection = createProductItemElement(productItem);
        document.querySelector('.items').appendChild(itemSection);
      }));
};

btnEmptyCart.addEventListener('click', () => {
  getCartItems.innerHTML = '';
  updateLocalStorage();
  sumTotalPrice();
});

function loadSavedCart() {
  const savedCart = localStorage.getItem('cartItems');
  if (savedCart !== null || undefined) {
  getCartItems.innerHTML = savedCart;
  }
  document.querySelectorAll('.cart__item').forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
}

window.onload = () => {
  fetchProduct('computador');
  loadSavedCart();
  sumTotalPrice();
};
