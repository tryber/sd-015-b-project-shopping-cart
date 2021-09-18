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

function getLocalStorage() {
  const saveStorage = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('item', JSON.stringify(saveStorage));
}

function cartItemClickListener(event) {
  const eventoClick = event.target;
  eventoClick.remove();
  getLocalStorage();
}

function saveLocalStorageOl() {
  const getLis = JSON.parse(localStorage.getItem('item'));
  const getOl = document.querySelector('ol');
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

        const classItems = document.querySelector('.items');
        const createProducts = createProductItemElement(listProducts);
        classItems.appendChild(createProducts);
    }))
    .catch(() => console.log('error'));
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
      const itemOl = document.querySelector('.cart__items');
      itemOl.appendChild(itemLi);
      getLocalStorage();
    })
    .catch(() => console.log('error na verificacao do id'));
}

function buttonId() {
  const items = document.querySelectorAll('.item');
  items.forEach((item) => item.lastChild.addEventListener('click', () => {
    getListIds(item);
  }));
}

window.onload = () => {
  createListElements('computador')
    .then(() => buttonId())
    .then(() => saveLocalStorageOl());
};
