const OlClass = '.cart__items';

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

function createProductItemElement({ sku, name, price, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', `R$${price}`));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function saveCart() {
  const cartItems = document.querySelectorAll('.cart__item');
  const itemForLocalStorage = [];

  cartItems.forEach((item) => {
    itemForLocalStorage.push(item.innerHTML);
  });

  localStorage.setItem('currentCart', JSON.stringify(itemForLocalStorage));
}

function calculeTotalAmount() {
  const allItemsCart = [...document.querySelectorAll('.cart__item')];
  const amount = document.querySelector('.total-price');

  const allValues = allItemsCart.map((item) => {
    const valueStr = item.innerText.split('$').reverse()[0];
    const valueNum = parseFloat(valueStr, 10);
    return valueNum;
  });

  const sum = allValues.reduce((total, current) => (total + current), 0);
  amount.innerText = `${sum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;

  saveCart();
}

function cartItemClickListener(event) {
  event.target.remove();
  calculeTotalAmount();
}

function retrieveSavedCart() {
  const listItems = document.querySelector(OlClass);
  const previousCart = JSON.parse(localStorage.getItem('currentCart'));

  previousCart.forEach((item) => {
    const li = document.createElement('li');
    li.innerHTML = item;
    li.classList.add('cart__item');
    li.addEventListener('click', cartItemClickListener);
    listItems.append(li);
  });
}

function resetCartItems() {
  const ol = document.createElement('ol');
  const olForReset = document.querySelector(OlClass);
  const cartSession = document.querySelector('.cart');

  olForReset.remove();
  ol.classList.add('cart__items');
  cartSession.append(ol);

  calculeTotalAmount();
}

function listenerForBtnReset() {
  const resetBtn = document.querySelector('.empty-cart');
  resetBtn.addEventListener('click', resetCartItems);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSearchValue() {
  return document.querySelector('#input-search').value;
}

function resetPageItems() {
  const container = document.querySelector('.container');
  const cart = document.querySelector('.cart');
  const items = document.querySelector('.items');
  const section = document.createElement('section');

  items.remove();
  section.classList.add('items');
  container.insertBefore(section, cart);
}

function checkApiSearch(search) {
  const mercadoLivreApi = `https://api.mercadolibre.com/sites/MLB/search?q=${search}`;

  return fetch(mercadoLivreApi);
}

async function fillPageWithItems(search) {
  try {
    const response = await checkApiSearch(search);
    const data = await response.json();
    const arrData = data.results.map(async ({ id, title, price }) => {
      const responseThumbnail = await fetch(`https://api.mercadolibre.com/items/${id}`);
      const dataThumbnail = await responseThumbnail.json();
      const thumbnail = dataThumbnail.pictures[0].url;
      const output = { sku: id, name: title, price, image: thumbnail };
      const sectionItems = document.querySelector('.items');
      const itemElement = createProductItemElement(output);
      sectionItems.append(itemElement);
    });

    await Promise.all(arrData)

  } catch (error) {
    console.error(error);
  }
}

function checkApiItems(element) {
  const elementId = getSkuFromProductItem(element);
  const mercadoLivreApiId = `https://api.mercadolibre.com/items/${elementId}`;

  return fetch(mercadoLivreApiId);
}

function addItemIntoCart(element) {
  checkApiItems(element)
    .then((response) => response.json())
    .then(({ id, title, price }) => {
      const output = { sku: id, name: title, salePrice: price };
      const ol = document.querySelector(OlClass);
      ol.append(createCartItemElement(output));
      calculeTotalAmount();
    });
}

function addListenersToBtns() {
  const allItems = document.querySelectorAll('.item');
  const loading = document.querySelector('.loading');

  allItems.forEach((item) => item.lastChild.addEventListener('click', (() => {
    addItemIntoCart(item);
  })));

  loading.remove();
}

async function initialExecOrder(search) {
  try {
    await fillPageWithItems(search);
    addListenersToBtns();
    calculeTotalAmount();
    listenerForBtnReset();
  } catch (error) {
    console.log(error);
  }
}

window.onload = () => {
  const retrieveCart = localStorage.getItem('currentCart');
  const btnSearch = document.querySelector('#button-search');
  const inputField = document.querySelector('#input-search');
  if (retrieveCart) retrieveSavedCart();
  initialExecOrder();
  btnSearch.addEventListener('click', () => {
    resetPageItems();
    initialExecOrder(getSearchValue());
  });
  inputField.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      resetPageItems();
      initialExecOrder(getSearchValue());
    }
  });
};
