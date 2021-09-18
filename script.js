const PC_SEARCH_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const ITEM_BASE_URL = 'https://api.mercadolibre.com/items/';

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function saveCartItems(ol) {
  localStorage.cartItems = ol.innerHTML;
}

function cartItemClickListener(event) {
  const cartItemsOl = event.target.parentElement;
  cartItemsOl.removeChild(event.target);
  saveCartItems(cartItemsOl);
}

function loadCartItems() {
  if (typeof localStorage.cartItems !== 'undefined') {
    const cartItemsOl = document.querySelector('.cart__items');
    cartItemsOl.innerHTML = localStorage.cartItems;

    // transforma HTMLColection em array
    const [...cartItems] = cartItemsOl.children;
    cartItems.forEach((item) => item.addEventListener('click', cartItemClickListener));
  }
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function handleAddButton(event) {
  const itemContainer = event.target.parentElement;
  const sku = getSkuFromProductItem(itemContainer);

  fetch(ITEM_BASE_URL + sku)
    .then((response) => response.json())
    .then(({ id, title, price }) => {
      const cartItemsOl = document.querySelector('.cart__items');
      const product = { sku: id, name: title, salePrice: price };
      cartItemsOl.appendChild(createCartItemElement(product));
      saveCartItems(cartItemsOl);
    });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));

  section.appendChild(button);
  button.addEventListener('click', handleAddButton);

  return section;
}

function fillItemsSection(products) {
  const itemsSection = document.querySelector('.items');
  products.forEach(({ id, title, thumbnail }) =>
    itemsSection.appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail })));
}

function fetchMercadoLivre() {
  fetch(PC_SEARCH_URL)
    .then((response) => response.json())
    .then(({ results: products }) => fillItemsSection(products));
}

window.onload = () => {
  fetchMercadoLivre();
  loadCartItems();
};
