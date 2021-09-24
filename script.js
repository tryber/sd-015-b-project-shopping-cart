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

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const sumPrices = () => {
  const getCartItems = document.querySelectorAll('.cart__item');
  const getTotalPrice = document.querySelector('.total-price');
  let acumulador = 0;
  getCartItems.forEach((items) => {
    const split = items.innerText.split('$')[1];
    acumulador += parseFloat(split);
  });
  getTotalPrice.innerText = acumulador;
};

function handleButtonCallback(event) {
  const objeto = event.target.parentNode;
  const id = getSkuFromProductItem(objeto);
  const url = `https://api.mercadolibre.com/items/${id}`;
  fetch(url)
  .then((response) => response.json())
  .then((item) => {
    const ol = document.querySelector('.cart__items');
    ol.appendChild(createCartItemElement(
      { sku: item.id, name: item.title, salePrice: item.price },
    ));
  }).then(() => sumPrices());
}

function handleButtonId() {
  const buttonId = document.querySelectorAll('.item__add');
  buttonId.forEach((element) => element.addEventListener('click', handleButtonCallback));
}

async function getItemsFromAPI() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(url)
  .then((result) => result.json())
  .then((infos) => infos.results)
  .then((item) => item.forEach((element) => {
    const items = document.querySelector('.items');
    items.appendChild(createProductItemElement(
      { sku: element.id, name: element.title, image: element.thumbnail },
    ));
  }))
  .then(() => handleButtonId())
  .then(() => {
    const loading = document.querySelector('.loading');
    loading.remove();
  });
}

function cleanList() {
  const cleanListButton = document.querySelector('.empty-cart');
  cleanListButton.addEventListener('click', () => {
    const li = document.querySelectorAll('.cart__item');
    li.forEach((element) => element.remove());
  });
}

window.onload = () => { 
  getItemsFromAPI();
  cleanList();
};
