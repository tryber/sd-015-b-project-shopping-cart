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

const getFetch = (url, onSucess, onFail) => {
  fetch(url)
    .then((response) => response.json())
    .then((response) => onSucess(response))
    .catch((error) => onFail(error));
};

async function getProductList(url, product, onSucess, onFail) {
  try {
    const urlSearch = `${url}${product}`;
    return await getFetch(urlSearch, onSucess, onFail);
  } catch (error) {
    console.log(`Erro encontrado no bloco getProductList(): ${error}`);
  }
}

const formatItemListProducts = (sku, name, image) =>
  ({ sku, name, image });

const appendProductItem = (target, element) =>
  target.appendChild(createProductItemElement(element));

const setItensOnPage = (response) => {
  const itens = [];
  response.results.forEach((res) =>
    itens.push(formatItemListProducts(res.id, res.title, res.thumbnail)));
  const mySection = document.getElementsByClassName('items')[0];
  itens.forEach((element) => appendProductItem(mySection, element));
};

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

const formatItemListCart = (sku, name, salePrice) =>
  ({ sku, name, salePrice });

const setItensOnCart = (response) => {
  const mySection = document.getElementsByClassName('cart__items')[0];
  mySection.appendChild(createCartItemElement(formatItemListCart(response.id,
    response.title, response.price)));
};

const getProductSelected = (event) => {
  if (event.target.className === 'item__add') {
    const itemSku = getSkuFromProductItem(event.target.parentElement);
    const url = 'https://api.mercadolibre.com/items/';
    getProductList(url, itemSku, setItensOnCart, console.log);
  }
};

const getClickAddButton = () => {
  const items = document.getElementsByClassName('items')[0];
  items.addEventListener('click', getProductSelected);
};

window.onload = () => {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=';
  const product = 'computador';
  getProductList(url, product, setItensOnPage, console.log);
  getClickAddButton();
};
