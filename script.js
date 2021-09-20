async function requestProductDetails(ids) {
  const API_URL2 = 'https://api.mercadolibre.com/items/';
  const response = await fetch(`${API_URL2}${ids}`);
  const infosRequest = await response.json();
  const { id, title, price } = infosRequest;
  const objectInfosRequest = await {
    sku: id,
    name: title,
    salePrice: price,
  };
  // console.log(objectInfosRequest);
  return objectInfosRequest;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// cria um elemento e é chamada na função createProductItemElement
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
  // adiciona evento ao clicar no item no carrinho
  // vai remover o item do carrinho
  const li = document.querySelectorAll('cart__item');
  console.log(event, li);
}
// espera como parametro o retorno de requestProductDetails
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addElementsCreated(infos) {
  const items = await document.querySelector('.items');
  const ol = document.querySelector('.cart__items');
  infos.forEach((info) => {
    const elementCreated = createProductItemElement(info);
    items.appendChild(elementCreated);
  });
  const item = document.querySelectorAll('.item');
  item.forEach((element) => {
    element.addEventListener('click', async () => {
      const itemSku = getSkuFromProductItem(element);
      const objectProduct = await requestProductDetails(itemSku);
      const cartItem = createCartItemElement(objectProduct);
      ol.appendChild(cartItem);
    });
  });
}
// requisicao a api do mlb 
async function requestProductMlb(product) {
  const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=';
  // filho do body span loading...
  const response = await fetch(`${API_URL}${product}`);
  const computers = await response.json();
  const results = await computers.results;
  // remover o filho de body com loading...
  const infosComputer = results.map(({ id, title, thumbnail }) => ({
    sku: id,
    name: title,
    image: thumbnail,
  }));
  // adiciona elementos criados como filhos de '.items'
  addElementsCreated(infosComputer);
}

window.onload = () => {
  requestProductMlb('computador');
};
