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

function getTotalItemValue(items) {
  const tPrice = document.querySelector('.total-price');
  let price = 0;
  items.forEach((item) => {
    const itemID = item.innerText.split(' ')[1];
    fetch(`https://api.mercadolibre.com/items/${itemID}`)
     .then((itemObject) => itemObject.json())
     .then((itemPrice) => {
       console.log(itemPrice.price);
       price += itemPrice.price;
     })
     .then(() => {
       tPrice.innerText = price;
       console.log(`o total é ${price}`);
      });
  });  
}

function updatePrice(option) {
  const tPrice = document.querySelector('.total-price');
  const items = document.querySelectorAll('.cart__item');
  if (items.length === 0) {
    tPrice.innerText = 0;
  } else {
  getTotalItemValue(items);
  }
  saveItems();
}

function cartItemClickListener(event) {
  const item = event.target;
  item.parentElement.removeChild(item);
  saveItems();
  updatePrice('remove');
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function handleCartItemElement(item) {
  const cartList = document.querySelector('.cart__items');
  const addedItem = createCartItemElement(item);
  cartList.appendChild(addedItem);
  updatePrice('add');
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

function emptyCart() {
  const cart = document.querySelector('.cart__items');
  cart.innerHTML = '';
  updatePrice();
}

window.onload = () => {
  requestProductAsync();
  loadItems();
  const emptyButton = document.querySelector('.empty-cart');
  emptyButton.addEventListener('click', emptyCart);
};