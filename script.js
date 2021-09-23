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
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Consultei o Erickson Siqueira para resolução desse requisito - link rep: https://github.com/tryber/sd-015-b-project-shopping-cart/pull/44/commits/e0863c5719b2f71b4ba9d503f045f084a9270797

async function getProductList(productName) {
  const API_URL = `https://api.mercadolibre.com/sites/MLB/search?q=${productName}`;
  const productListPromise = await fetch(API_URL);
  const productListConverted = await productListPromise.json();

  return productListConverted;
}

function makeObjForProductItem(product) {
  const { id, title, thumbnail } = product;
  const productObj = { sku: id, name: title, image: thumbnail };
  return productObj;
}

async function generateProductList(prodctName) {
  const productList = await getProductList(prodctName);
  const prodctListResults = productList.results;
  const itemsSections = document.querySelector('.items');

  prodctListResults.forEach((product) => {
    const objForProductItem = makeObjForProductItem(product);
    const productItemElement = createProductItemElement(objForProductItem);
    itemsSections.appendChild(productItemElement);
  });
}

window.onload = () => {
  generateProductList('computador');
};
