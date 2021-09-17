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

function addItemToCart() {
  const sku = getSkuFromProductItem(this.parentElement);
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then((response) => response.json())
    .then(({ id, title, price }) => {
      const item = { sku: id, name: title, salePrice: price };
      const cartItem = createCartItemElement(item);
      document.querySelector('.cart__items').appendChild(cartItem);
    });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const btnAddToCart = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  btnAddToCart.addEventListener('click', addItemToCart);
  section.appendChild(btnAddToCart);

  return section;
}

const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

const fetchProduct = () => {
  fetch(API_URL)
    .then((response) => response.json())
    .then((productsList) => productsList.results
      .forEach(({ id, title, thumbnail }) => {
        const product = { sku: id, name: title, image: thumbnail };
        const itemSection = createProductItemElement(product);
        document.querySelector('.items').appendChild(itemSection);
      }));
};

window.onload = () => fetchProduct();
