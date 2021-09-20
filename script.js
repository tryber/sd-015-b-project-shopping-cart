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
  section.appendChild(createCustomElement('button',
    'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

async function getComputer() { 
  const data = await fetch(API_URL);
  const getComputerSearch = await data.json();
  return getComputerSearch.results.forEach(({ id, title, thumbnail }) => {
    const resultPromisse = {
      sku: id,
      name: title,
      image: thumbnail,
    };
    const selectItems = document.querySelector('.items');
    const product = createProductItemElement(resultPromisse);
    selectItems.appendChild(product);
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// MLB1790675058
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

async function getProductId(item) {
  const itenId = getSkuFromProductItem(item);
  const data = await fetch(`https://api.mercadolibre.com/items/${itenId}`);
  const getComputerId = await data.json();
  const { id, title, price } = getComputerId;
  const resultItem = { sku: id, name: title, salePrice: price };
  const selectItems = document.querySelector('.cart__items');
  const productt = createCartItemElement(resultItem);
  selectItems.appendChild(productt);
}

function buttonProduct() {
  const itens = document.querySelectorAll('.item__add');
  return itens.forEach((iten) => {
    iten.addEventListener('click', (() => getProductId(iten.parentElement)));
  });
}

const requestsAsincronos = async () => {
  await getComputer();
  buttonProduct();
};

window.onload = () => {  
  requestsAsincronos();
};
