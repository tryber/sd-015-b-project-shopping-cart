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
  const buttonTest = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  buttonTest.id = sku;
  section.appendChild(buttonTest);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function savingList() {
  const cart = document.querySelector('.cart');
  localStorage.setItem('cartList', cart.innerHTML);
}

function cartItemClickListener(event) {
event.target.remove();
  savingList();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function handleItem(item) {
const cartItem = document.querySelector('.cart__items');
const itemAdd = createCartItemElement(item);
cartItem.appendChild(itemAdd);
}

function createItemSelector(event) {
  const product = event.target.parentElement;
  const productChildren = product.children[0].innerText;
  fetch(`https://api.mercadolibre.com/items/${productChildren}`)
  .then((response) => response.json())
  .then((item) => handleItem(item))
  .then(() => savingList());
}

function createAdicionalProductButton() {
  const addProductButton = document.querySelectorAll('.item__add');
  addProductButton.forEach((buttons) => buttons.addEventListener('click', createItemSelector));
}

function createListwithItens(object) {
const itemList = document.querySelector('.items');
for (let i = 0; i < object.length; i += 1) {
  const createItems = createProductItemElement(object[i]);
  itemList.appendChild(createItems);
}
}

  function makingApiWork() {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then((response) => response.json())
    .then((object) => createListwithItens(object.results))
    .then(() => createAdicionalProductButton());
  }

  function loadingList() {
    const cart = document.querySelector('.cart');
    const savedCart = localStorage.getItem('cartList');
    if (savedCart) {
      cart.innerHTML = savedCart;
      }
      const cartItem = document.querySelectorAll('.cart__item');
      cartItem.forEach((item) => item.addEventListener('click', cartItemClickListener));
    }

window.onload = () => {
  makingApiWork();
  loadingList();
};