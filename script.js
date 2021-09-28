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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const buttonTest = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  buttonTest.id = sku;
  section.appendChild(buttonTest);
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

function createItemSelector(event) {
  const product = getSkuFromProductItem(event.target.parentElement);
  const productList = document.querySelector('.cart__items');
  fetch(`https://api.mercadolibre.com/items/${product}`)
  .then((response) => response.json())
  .then((item) => productList.appendChild(createCartItemElement(
    { sku: item.id, name: item.title, salePrice: item.price },
  )))
};

function createAdicionalProduct () {
  const addProductButton = document.querySelectorAll('.item__add');
  addProductButton.forEach((buttons) => buttons.addEventListener('click', createItemSelector))
}

const createListwithItens = (object) => {
const itemList = document.querySelector('.items');
for (let i = 0; i < object.length; i += 1) {
  const createItems = createProductItemElement(object[i]);
  itemList.appendChild(createItems);
}
};

createAdicionalProduct();

const makingApiWork = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
  .then((response) => response.json())
  .then((object) => createListwithItens(object.results));
};

window.onload = () => {
  makingApiWork();
};