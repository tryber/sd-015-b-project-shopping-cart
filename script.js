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

function createProductOjbect(dados) {
  const itemDiv = document.querySelector('.items');
  dados.forEach((dado) => {
    const item = createProductItemElement(dado);
    itemDiv.appendChild(item);
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function saveItems() {
  const cart = document.querySelector('.cart');
  localStorage.setItem('shoppingCart', cart.innerHTML);
}

function cartItemClickListener(event) {
  const item = event.target;
  item.parentElement.removeChild(item);
  saveItems();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function handleCartItemElement(item) {
  const cart = document.querySelector('.cart__items');
  const addedItem = createCartItemElement(item);
  cart.appendChild(addedItem);
}

function itemClickListener(event) {
  const button = event.target;
  const section = button.parentElement;
  const itemID = section.children[0].innerText;
  fetch(`https://api.mercadolibre.com/items/${itemID}`)
    .then((item) => item.json())
    .then((item) => handleCartItemElement(item))
    .then(() => saveItems());
}

function handleAddBtn() {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => button.addEventListener('click', itemClickListener));
}

function requestProductAsync() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then((response) => response.json())
    .then((dados) => dados.results)
    .then((dados) => createProductOjbect(dados))
    .then(() => handleAddBtn());
}

function loadItems() {
  const cart = document.querySelector('.cart');
  const savedCart = localStorage.getItem('shoppingCart');
  if (savedCart) {
    cart.innerHTML = savedCart;
  }
  const itemList = document.querySelectorAll('.cart__item');
  itemList.forEach((item) => item.addEventListener('click', cartItemClickListener));
}

window.onload = () => {
  requestProductAsync();
  loadItems();
};
