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

function createCardItemElement({ id, title, price }) {
  const list = document.querySelector('.cart__items');
  const row = document.createElement('li');
  row.classList = 'cart__items';
  row.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  list.appendChild(row);
}

function getCartRequest(event) {
  const IDrequest = event.path[1].childNodes[0].innerText;
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
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
}

function getElementsItems(result) {
  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(createProductItemElement(result));
}

function getRequest() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  
  fetch(url)
    .then((response) => response.json())
    .then((data) => data.results)
    .then((results) => results.forEach((result) => getElementsItems(result)));
}

window.onload = () => {
  getRequest();
};
