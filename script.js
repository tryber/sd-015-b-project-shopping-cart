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
  const list = document.querySelector('.cart__items');
  const row = document.createElement('li');
  row.classList = 'cart__items';
  row.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  row.addEventListener('click', cartItemClickListener);
  console.log(row, list, '27');
  list.appendChild(row);
}

function getCartRequest(event) {
  const IDrequest = event.path[1].childNodes[0].innerText;
  //console.log(IDrequest, '33');
  fetch(`https://api.mercadolibre.com/items/${IDrequest}`)
    .then((response) => response.json())
    .then(({ id, title, price }) => {
      createCardItemElement({ id, title, price });
  });
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.addEventListener('click', getCartRequest);
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  //console.log(section, '49');
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function getElementsItems(result) {
  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(createProductItemElement(result));
}

async function getRequest(url) {
  return fetch(url)
    .then((response) => response.json())
    .then((data) => data.results)
    .then((results) => results.forEach((result) => getElementsItems(result)));
}

window.onload = () => {
  getRequest(MLBurl);
};
