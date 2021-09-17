const getProductsList = async () => {
  const wantedProduct = 'computador';
  const API_URL = `https://api.mercadolibre.com/sites/MLB/search?q=${wantedProduct}`;
  const data = await fetch(API_URL);
  const translatedData = await data.json();
  return translatedData.results;
};

const getProductBySku = async (sku) => {
  const data = await fetch(`https://api.mercadolibre.com/items/${sku}`);
  const translatedData = await data.json();
  return translatedData;
};

const createImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const cartItemClickListener = (event) => {
  event.target.remove();
};

const createCartItemElement = ({ id: sku, title: name, price: salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const getSkuFromProductItem = (item) => item.querySelector('span.item__sku').innerText;

const handleAddItemBtn = async (event) => {
  const itemSku = getSkuFromProductItem(event.target.parentElement);
  const item = await getProductBySku(itemSku);
  const cartItem = createCartItemElement(item);
  const cart = document.querySelector('.cart__items');
  cart.appendChild(cartItem);
};

const createProductItemElement = ({ id: sku, title: name, thumbnail: image }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createImageElement(image));
  const addItemBtn = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(addItemBtn);
  addItemBtn.addEventListener('click', handleAddItemBtn);
  return section;
};

const renderItemsList = (itemList) => {
  const itemsPlace = document.querySelector('.items');
  itemList.forEach((item) => {
    itemsPlace.appendChild(createProductItemElement(item));
  });
};

window.onload = async () => {
  const list = await getProductsList();
  renderItemsList(list);
};
