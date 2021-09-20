function totalValuesCount() {
  const values = this.items.reduce((acc, elemento) => {
    let actual = acc;
    actual += Object.values(elemento)[0];
    return actual;
  }, 0);
  return parseFloat(values.toFixed(2));
}

function removeItemsObj(id) {
  const el = this.items.find((elemento) => Object.keys(elemento)[0] === id);
  const elementPosition = this.items.indexOf(el);
  this.items.splice(elementPosition, 1);
}

const totalPriceObj = {
  items: [],
  totalValue: totalValuesCount,
  removeItem: removeItemsObj,
};

function showTotalValue() {
  const spanElement = document.querySelector('.total-price');
  spanElement.innerText = `${totalPriceObj.totalValue()}`;
}

function finalValue({ id, price }) {
  const productPrice = parseFloat(price.toPrecision(5));
  totalPriceObj.items.push({ [id]: productPrice });
  
  showTotalValue();
}

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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const orderedList = document.getElementsByClassName('cart__items');
  const eventTarget = event.target;

  orderedList[0].removeChild(eventTarget);
  const id = eventTarget.innerText.split(' ')[1];
  totalPriceObj.removeItem(id);

  showTotalValue();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function insertCartElement(element) {
  const getCart = document.querySelector('.cart__items');
  const createdCartElement = createCartItemElement(element);

  getCart.appendChild(createdCartElement);
}

async function addToCart(clickedElement) {
  const elementId = getSkuFromProductItem(clickedElement);
  const fetchResponse = await fetch(`https://api.mercadolibre.com/items/${elementId}`);
  const response = await fetchResponse.json();

  insertCartElement(response);
  finalValue(response);
}

function createEventListenner(element) {
  const elementButton = element.querySelector('button');
  elementButton.addEventListener('click', () => addToCart(element));
}

function insertElement(element) {
  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(element);
}

function getElements(arrayResult) {
  arrayResult.forEach((elemento) => {
    const element = createProductItemElement(elemento);
    insertElement(element);
    createEventListenner(element);
  });
}

function loadingText() {
  const sectionItems = document.getElementsByClassName('items')[0];
  const h1 = document.createElement('h1');
  h1.innerText = 'loading...';
  h1.className = 'loading';
  sectionItems.appendChild(h1);
}

function loadingTextDelete() {
  const loadingScreen = document.querySelector('.loading');
  loadingScreen.remove();
}

async function getData() {
  loadingText();
  try {
    const fetchResponse = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
    const response = await fetchResponse.json();

    loadingTextDelete();
    const { results } = response;
    getElements(results);
  } catch (error) {
    console.error(error);
  }
}

function eraseAllItems() {
  const nodeListOfAllItems = document.querySelectorAll('.cart__item');
  nodeListOfAllItems.forEach((elemento, index) => nodeListOfAllItems[index].remove(elemento));
}

function eraseBtnEventListener() {
  const eraseBtn = document.querySelector('.empty-cart');
  eraseBtn.addEventListener('click', eraseAllItems);
}

window.onload = () => { 
 getData();
 eraseBtnEventListener();
};
