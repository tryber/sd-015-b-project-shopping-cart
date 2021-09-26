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

function productConsult(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then(({ title, price }) => {
      const object = {
        sku: id,
        name: title,
        salePrice: price,
      };
      const cart = document.querySelector('.cart__items');
      cart.appendChild(createCartItemElement(object));
    });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const butao = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  butao.addEventListener('click', () => { productConsult(sku); });
  section.appendChild(butao);

  return section;
}

 const apiMarket = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then((response) => response.json())
    .then((listItems) => listItems.results.forEach(({ id, title, thumbnail }) => {
      const product = createProductItemElement({ sku: id, name: title, image: thumbnail });
      const items = document.querySelector('.items');
      items.appendChild(product);
}));
  document.querySelector('.loading').remove();
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
function ApagaTudo() {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerText = '';
}

window.onload = () => { 
  apiMarket();
  const butaoApagar = document.querySelector('.empty-cart');
  butaoApagar.addEventListener('click', ApagaTudo);
};
