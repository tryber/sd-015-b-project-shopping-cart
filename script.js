/* eslint-disable sonarjs/no-use-of-empty-return-value */
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
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

function getProduct() {
  return fetch(API_URL)
    .then((data) => data.json())
    .then((listItens) => listItens.results.forEach(({ id, title, thumbnail }) => {
      const listInfos = { sku: id, name: title, image: thumbnail };
      const classItens = document.querySelector('.items');
      const createElement = createProductItemElement(listInfos);
      classItens.appendChild(createElement);
    }));
}

const setItemLocal = () => {
  const saveStorage = [...document.querySelectorAll('.cart__item')];
  console.log(saveStorage);
  const arrSave = [];
  saveStorage.forEach((element) => {
    arrSave.push(element.innerHTML);
  }); 

  localStorage.setItem('chave', JSON.stringify(arrSave));
};

const getItemLocal = () => {
  const restore = JSON.parse(localStorage.getItem('chave'));
  restore.forEach((element) => {
    const li = document.createElement('li');
    const listaTotal = document.querySelector('.cart__items');
    li.innerHTML = element;
    li.classList.add('cart__item');
    li.addEventListener('click', cartItemClickListener);
    listaTotal.appendChild(li);
  });
};

function fetchID(idItem) {
  const valueItem = getSkuFromProductItem(idItem);
  const API_ID = `https://api.mercadolibre.com/items/${valueItem}`;
  fetch(API_ID)
    .then((response) => response.json())
    .then(({ id, title, price }) => {
      const priceItem = {
        sku: id,
        name: title,
        salePrice: price,
      };
      const cartItem = createCartItemElement(priceItem);
      const ol = document.querySelector('.cart__items');
      ol.appendChild(cartItem);
      setItemLocal();
    })
    .catch(() => console.error('Seu item não está disponivel'));
}

function botao() {
  const items = document.querySelectorAll('.item');
  items.forEach((item) => item.lastChild.addEventListener('click', () => fetchID(item)));
}

function apagaTudo() {
  const listaCompleta = document.querySelector('.cart__items');
  listaCompleta.innerHTML = ' ';
}

const contentLocalStorage = localStorage.getItem('chave');
window.onload = () => {
  getProduct()
  .then(() => botao());  
  if (contentLocalStorage) return getItemLocal();
  const limparCarrinho = document.querySelector('.empty-cart');
  limparCarrinho.addEventListener('click', apagaTudo);
};