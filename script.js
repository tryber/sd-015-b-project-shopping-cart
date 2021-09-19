function requestApiML() {
  return fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
          .then((response) => response.json());
}

function requestApiItems(itemID) {
  return fetch(`https://api.mercadolibre.com/items/${itemID}`)
          .then((response) => response.json());
}


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
  saveCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getItem = () =>
  requestApiML()
    .then((listItems) => listItems.results.forEach(({ id, title, thumbnail }) => {
      const item = {
        sku: id,
        name: title,
        image: thumbnail,
      };

      const sectionItems = document.querySelector('.items');
      sectionItems.appendChild(createProductItemElement(item));
  }));

const saveCart = () => {
  const cartItems = document.querySelector('.cart__items');
  const cartItemsHTML = cartItems.innerHTML;
  localStorage.setItem('cartItems', cartItemsHTML);
};

const getCart = () => {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = localStorage.getItem('cartItems');
};

const addItemToCart = (item) => {
  const getItemID = getSkuFromProductItem(item);
  requestApiItems(getItemID)
  .then(({ id, title, price }) => {
      const infoItem = {
        sku: id,
        name: title,
        salePrice: price,
      };
      const cartItems = document.querySelector('.cart__items');
      cartItems.appendChild(createCartItemElement(infoItem));
      saveCart();
    });
};

const addEventButton = () => {
  const items = document.querySelectorAll('.item');
  items.forEach((item) => item.lastChild.addEventListener('click', (() => addItemToCart(item))));
  return items;
};

window.onload = () => { 
  getItem()
    .then(() => addEventButton())
    .then(() => getCart());
};
