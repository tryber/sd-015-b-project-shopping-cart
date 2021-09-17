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
  const sectionMaster = document.querySelector('section.items');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  sectionMaster.append(section);

  return section;
}

function getIdFromProductItem(item) {
  return item.querySelector('span.item__id').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ id, title, price }) {
  const ol = document.querySelector('ol.cart__items');
  const li = document.createElement('li');

  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  ol.appendChild(li);
  return li;
}

function requestApiItem(ItemID) {
  return fetch(`https://api.mercadolibre.com/items/${ItemID}`)
    .then((response) => response.json().then((data) => {
      createCartItemElement(data);
    }));
}

function requestApiMercado() {
  return fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json().then((data) => {
  data.results.forEach((element) => createProductItemElement(element));
  
  return data;
}));
}

window.onload = () => {
  const buttonAddInCart = document.querySelector('section.items');
  requestApiMercado();
  buttonAddInCart.addEventListener('click', (event) => {
    if (event.target.classList.contains('item__add')) {
      return requestApiItem(event.target.parentNode.firstChild.innerText);
    }
  });
 };
