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

function cartItemClickListener(event) {
  const targetEvent = event.target;
  const getCartItem = document.querySelector('.cart__items');
  getCartItem.removeChild(targetEvent);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  const getCart = document.querySelector('.cart__items');
  getCart.appendChild(li);
  return li;
}

function getProductsEvent(event) {
  const id = getSkuFromProductItem(event.target.parentNode);
  const url = `https://api.mercadolibre.com/items/${id}`;
  fetch(url)
  .then((element) => element.json())
  .then((data) => createCartItemElement({ sku: data.id, name: data.title, salePrice: data.price }));
}

function getEventButton(p) {
  p.forEach((element) => {
    element.addEventListener('click', getProductsEvent);
  });
}

const requestProductsApi = async (url) => {
  const requestApiForItems = fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computer');
  requestApiForItems.then((element) => element.json())
  .then((element) => element.results)
  .then((element) => element.forEach((value) => {
  const responsePattern = { sku: value.id, name: value.title, image: value.thumbnail };
  const item = document.querySelector('.items'); 
  item.appendChild(createProductItemElement(responsePattern));
  const getButton = document.querySelectorAll('.item__add');
  getEventButton(getButton);
 }));
};

window.onload = () => { 
  requestProductsApi();
};
