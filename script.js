const URL_COMPUTER = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

const setLocalStorage = () => {
  const localOl = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('key', JSON.stringify(localOl));
};

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
  setLocalStorage();
}

const getLocalStorage = () => {
  const getLi = JSON.parse(localStorage.getItem('key'));
  const selectOl = document.querySelector('ol');
  selectOl.innerHTML = getLi;
  selectOl.addEventListener('click', cartItemClickListener);
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const mlComputerFetch = () => fetch(URL_COMPUTER)
  .then((response) => response.json())
  .then((arrayMl) => arrayMl.results.forEach(({ id, title, thumbnail }) => {
    const objDestruct = {
      sku: id,
      name: title,
      image: thumbnail,
    };
    const selectItem = document.querySelector('.items');
    const createItemElement = createProductItemElement(objDestruct);
    selectItem.appendChild(createItemElement);
  }));

const getIdResponse = (itemId) => {
  const getIdFromFunction = getSkuFromProductItem(itemId);
  const GET_ID_API = `https://api.mercadolibre.com/items/${getIdFromFunction}`;
  return fetch(GET_ID_API)
  .then((response) => response.json())
  .then(({ id, title, price }) => {
    const itemPriceObj = {
      sku: id,
      name: title,
      salePrice: price,
    };
    const selectOl = document.querySelector('.cart__items');
    const createCartItem = createCartItemElement(itemPriceObj);
    selectOl.appendChild(createCartItem);
    setLocalStorage();
  })
  .catch(() => console.log('Não foi possivel acessar o carrinho'));
};

const button = () => {
  const getItemsElements = document.querySelectorAll('.item');
  getItemsElements.forEach((item) => {
    item.lastChild.addEventListener('click', () => getIdResponse(item));
  });
};

window.onload = () => {
  mlComputerFetch()
  .then(() => button())
  .then(() => getLocalStorage());
};