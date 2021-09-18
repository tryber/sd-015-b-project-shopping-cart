const retrieveCart = localStorage.getItem('SavedCart');
const cartItems = ('.cart__items');

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

function saveStorage() {
  const cartItem = [...document.querySelectorAll('.cart__item')];
  const ItemStorage = [];
  
  cartItem.forEach((item) => {
    ItemStorage.push(item.innerHTML);
  });
  
  localStorage.setItem('SavedCart', JSON.stringify(ItemStorage));
}

const totalPrice = '.total-price';
async function payment() {
  const totalCart = [...document.querySelectorAll('.cart__item')];
  document.querySelector(totalPrice).innerText = 0;
  
  const getAllValues = totalCart.map((value) => {
    const valueString = value.innerText.split('$').reverse()[0];
    const stringToNumber = parseFloat(valueString, 10);
    return stringToNumber;
  });
  
  const sum = getAllValues.reduce((result, current) => (result + current), 0);
  document.querySelector(totalPrice).innerText = `${sum}`;
}

function cartItemClickListener(event) {
  event.target.remove();
  payment();
  saveStorage();
}

function resetButton() {
  const ol = document.createElement('ol');
  const olReset = document.querySelector(cartItems);
  const cartArea = document.querySelector('.cart');
  olReset.remove();
  payment();
  ol.classList.add('cart__items');
  cartArea.append(ol);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCart = (item) => {
  const getId = getSkuFromProductItem(item);
  fetch(`https://api.mercadolibre.com/items/${getId}`)
    .then((response) => response.json())
    .then(({ id, title, price }) => {
      const idInfos = {
        sku: id,
        name: title,
        salePrice: price,
      };
      const ol = document.querySelector(cartItems);
      ol.append(createCartItemElement(idInfos));
      payment();
      saveStorage();
    });
};

const addEventToButtons = () => {
  const allItems = document.querySelectorAll('.item');
  allItems.forEach((item) => item.lastChild.addEventListener('click', (() => 
  addToCart(item))));

  return allItems;
};

const requestMercadoLibre = () => 
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((listItems) => listItems.results.forEach(({ id, title, thumbnail }) => {
      const itemInfos = { 
        sku: id, 
        name: title, 
        image: thumbnail,
      };
      const sectionItems = document.querySelector('.items');
      const itemElement = createProductItemElement(itemInfos);
      sectionItems.append(itemElement);
  }));

function recoverySavedList() {
  const recoveryList = JSON.parse(localStorage.getItem('SavedCart'));
    
  recoveryList.forEach((item) => {
    const li = document.createElement('li');
    const listItems = document.querySelector(cartItems);
      li.innerHTML = item;
      li.classList.add('cart__item');
      li.addEventListener('click', cartItemClickListener);
      listItems.append(li);
  });
}

function loadOrder() {
  requestMercadoLibre()
    .then(() => document.querySelector('.loading').remove())
    .then(() => addEventToButtons())
    .then(() => payment())
    .catch(() => ('Ops, endereço não encontrado! =('));
}
window.onload = () => { 
  if (retrieveCart) recoverySavedList();
  loadOrder();
  const removeButton = document.querySelector('.empty-cart');
  removeButton.addEventListener('click', resetButton);
};
