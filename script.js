const urlApiItems = 'https://api.mercadolibre.com/sites/MLB/search?q=$';
const urlApiItemForCart = 'https://api.mercadolibre.com/items/';
const itemName = 'computador';

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
  // coloque seu código aqui
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getItemFromApi = async (apiUrl, item) => {
  try {
    const response = await fetch(`${apiUrl}${item}`);
    const itemsData = await response.json();
    return itemsData;
  } catch (error) {
    console.log(error);
  }
};

const appendElementTo = (element, parentClass) => {
  const parent = document.querySelector(`.${parentClass}`);
  parent.appendChild(element);
};

const renderItems = async () => {
  const itemsData = await getItemFromApi(urlApiItems, itemName);
  const items = itemsData.results;

  items.forEach((item) => {
    const createdItem = createProductItemElement(item);
    appendElementTo(createdItem, 'items');
  });
};

const itemsClickListener = async (event) => {
  if (event.target.className === 'item__add') {
    const itemId = getSkuFromProductItem(event.target.parentElement);
    const item = await getItemFromApi(urlApiItemForCart, itemId);
    const cartElement = createCartItemElement(item);
    appendElementTo(cartElement, 'cart__items');
  } 
};

const addClickListenerToAllItems = () => {
  const itemsSection = document.querySelector('.items');
  itemsSection.addEventListener('click', itemsClickListener);
};

window.onload = () => { 
  renderItems();
  addClickListenerToAllItems();
};
