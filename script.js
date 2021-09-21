const cartItems = '.cart__items';

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

function saveLocalStorage() {
  const saveStorage = document.querySelector(cartItems).innerHTML;
  localStorage.setItem('item', JSON.stringify(saveStorage));
}

function sumCart() {
  const getClassItem = [...document.querySelectorAll('.cart__item')];
  const getValues = getClassItem.map((value) => {
    const splited = value.innerText.split('$')[1];
    const number = parseFloat(splited, 10);
    return number;
  });
  const result = getValues.reduce((acc, curr) => (acc + curr), 0);
  document.querySelector('.total-price').innerText = `${result}`;
}

function cartItemClickListener(event) {
  event.target.remove();
  sumCart();
  saveLocalStorage();
}

function recoveryLocalStorageOl() {
  const getLis = JSON.parse(localStorage.getItem('item'));
  const getOl = document.querySelector(cartItems);
  getOl.innerHTML = getLis;
  getOl.addEventListener('click', cartItemClickListener);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function createListElements(products) {
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${products}`)
    .then((response) => response.json())
    .then((list) => list.results.forEach(({ id, title, thumbnail }) => {
        const listProducts = {
          sku: id,
          name: title,
          image: thumbnail,
        };

        const selectAllItems = document.querySelector('.items');
        const cartProducts = createProductItemElement(listProducts);
        selectAllItems.appendChild(cartProducts);
    }));
}

function getListIds(idItem) {
  const getInfoItem = getSkuFromProductItem(idItem);
  fetch(`https://api.mercadolibre.com/items/${getInfoItem}`)
    .then((response) => response.json())
    .then(({ id, title, price }) => {
      const idProducts = {
        sku: id,
        name: title,
        salePrice: price,
      };

      const itemLi = createCartItemElement(idProducts);
      const itemOl = document.querySelector(cartItems);
      itemOl.appendChild(itemLi);
      sumCart();
      saveLocalStorage();
    })
    .catch(() => console.log('error na verificacao do id'));
}

function buttonId() {
  const items = document.querySelectorAll('.item');
  items.forEach((item) => item.lastChild.addEventListener('click', () => {
    getListIds(item);
    sumCart();
  }));
}

function buttonClearCart() {
  const getOl = document.querySelector(cartItems);
  const getSpan = document.querySelector('.total-price');
    getOl.innerHTML = '';
    getSpan.innerHTML = '';
    saveLocalStorage();
}

function createSpanLoading() {
  const container = document.querySelector('.container');
  container.appendChild(createCustomElement('span', 'loading', 'loading...'));
}

window.onload = () => {
  createSpanLoading();
  createListElements('computador')
    .then(() => document.querySelector('.loading').remove())
    .then(() => buttonId())
    .then(() => recoveryLocalStorageOl())
    .then(() => sumCart())
    .then(() => {
      const buttonClearOl = document.querySelector('.empty-cart');
      buttonClearOl.addEventListener('click', buttonClearCart);
    })
    .catch(() => console.log('Fatal ERROR'));
};
