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

function cartItemClickListener(event) {
  const cartItem = event.target;
  const cart = cartItem.parentElement;
  cart.removeChild(cartItem);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getProductId(element) {
  const sectionItem = element.parentElement;
  return sectionItem.firstElementChild.innerText;
}

async function getProductByIdFromEndpoint(event) {
  const button = event.target;
  const itemId = await getProductId(button);

  const response = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const data = await response.json();

  const cartItem = document.querySelector('.cart__items');
  cartItem.appendChild(createCartItemElement(
    { sku: data.id, name: data.title, salePrice: data.price },
  ));
}

async function handleItemsListButtonEventAdd() {
  const itemsListButtons = document.querySelectorAll('.item__add');
  itemsListButtons.forEach((button) => {
    button.addEventListener('click', getProductByIdFromEndpoint);
  });
}

async function getProductsFromEndpoint() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const data = await response.json();
  await data.results.forEach((itemOnSale) => {
    const item = document.querySelector('.items');
    item.appendChild(createProductItemElement(
      { sku: itemOnSale.id, name: itemOnSale.title, image: itemOnSale.thumbnail },
    ));
  });
  await handleItemsListButtonEventAdd();
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function handleAll() {
//   getProductsFromEndpoint();
// }

window.onload = () => { 
  getProductsFromEndpoint();
};
