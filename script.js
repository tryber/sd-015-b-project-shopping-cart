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

const saveStorage = () => {
  const shopCart = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('key', JSON.stringify(shopCart));
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
  saveStorage();
}

const getStorage = () => {
  const recovery = JSON.parse(localStorage.getItem('key'));
  const ol = document.querySelector('ol');
  ol.innerHTML = recovery;
  ol.addEventListener('click', cartItemClickListener);
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const apiMercadoLivre = () =>
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((listItems) => listItems.results.forEach(({ id, title, thumbnail }) => {
      const infoItems = { sku: id, name: title, image: thumbnail };
      const sectionItems = document.querySelector('.items');
      const addCartItems = createProductItemElement(infoItems);
      sectionItems.appendChild(addCartItems);
}));

const addItemByIdToShop = (idItem) => {
  const returnId = getSkuFromProductItem(idItem);
  return fetch(`https://api.mercadolibre.com/items/${returnId}`)
    .then((response) => response.json())
    .then(({ id, title, price }) => {
      const priceItem = { sku: id, name: title, salePrice: price };
      const selectCart = document.querySelector('.cart__items');
      selectCart.appendChild(createCartItemElement(priceItem));
      saveStorage();
    });
};

const buttonToCart = () => {
  const shoppingItems = document.querySelectorAll('.item');
  shoppingItems.forEach((item) => item.lastChild
  .addEventListener('click', () => addItemByIdToShop(item)));
};

window.onload = () => { 
  apiMercadoLivre()
    .then(() => buttonToCart())
    .then(() => getStorage());
};
