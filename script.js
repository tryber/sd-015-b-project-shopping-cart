const MLBurl = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';

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

function cartItemClickListener(event) {
  event.target.remove();
}

function createCardItemElement({ id, title, price }) {
  const row = document.createElement('li');
  row.classList = 'cart__items';
  row.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  row.addEventListener('click', cartItemClickListener);
  return row;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createList(output) {
  const list = document.querySelector('.cart__items');
  list.appendChild(output);
}

async function searchIdInResult(element) {
  const IDrequest = getSkuFromProductItem(element.path[1]);
  return fetch(`https://api.mercadolibre.com/items/${IDrequest}`)
    .then((response) => response.json())
    .then(({ id, title, price }) => {
      createList(createCardItemElement({ id, title, price }));  
  });
}

function addListenerButton() { 
  const items = document.querySelectorAll('.item');
  // items.forEach((item) => item.addEventListener('click', (() => {
  //   searchIdInResult(item);
  // })));
  Object.keys(items).forEach((item) => {
    items[item].addEventListener('click', searchIdInResult);
  });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.addEventListener('click', addListenerButton);
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

function getElementsItems(result) {
  const sectionItems = document.querySelector('.items');
  const itemElement = createProductItemElement(result);
  sectionItems.append(itemElement);
}

async function getRequest(url) {
  return fetch(url)
    .then((response) => response.json())
    .then((listSearch) => listSearch.results.forEach(({ id, title, thumbnail }) => {
      const output = { sku: id, name: title, image: thumbnail };
      getElementsItems(output); 
    }));
}

function order() {
  getRequest(MLBurl)
    .then(() => addListenerButton());
}

window.onload = () => {
  order();
};
