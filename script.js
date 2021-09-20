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

function attCart() {
  const cart = document.querySelector('.cart__items');
  return cart;
}

function cartItemClickListener() {
    const cart = attCart();
    const li = this;
    cart.removeChild(li);
}

function clearCart() {
  const cart = attCart();
  const itens = document.querySelectorAll('.cart__item');
  itens.forEach((element) => {
    cart.removeChild(element);
  });
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addToCart() {
  const id = getSkuFromProductItem(this);

  const itemAPI = `https://api.mercadolibre.com/items/${id}`;
  fetch(itemAPI)
  .then((response) => response.json())
  .then(({ title, price }) => {
    const cart = document.querySelector('.cart__items');
    cart.appendChild(createCartItemElement(
      { sku: id, name: title, salePrice: price },
      ));
    })
    .catch((erro) => console
    .error(`${erro}: Possivelmente erro no link da API`));
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.addEventListener('click', addToCart);
  return section;
}

function findItems(product) {
  const API_LINK = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
  fetch(API_LINK)
  .then((response) => response.json())
  .then((obj) => obj.results)
  .then((products) => products.forEach((item) => {
    const items = document.querySelector('.items');
    items.appendChild(createProductItemElement(
      { sku: item.id, name: item.title, image: item.thumbnail },
      ));
    }))
    .then(() => {
    const itemsContainer = document.querySelector('.items');
    const loading = document.querySelector('.loading');
    itemsContainer.removeChild(loading);
    })
    .catch((erro) => console
    .error(`${erro}: Possivelmente erro no link da API`));
  }

  async function loadScreen() {
    const loadText = document.createElement('h1');
    const itemsContainer = document.querySelector('.items');
    loadText.className = 'loading';
    loadText.innerText = 'LOADING...';
    itemsContainer.appendChild(loadText);
    try {
      await findItems('computador');
    } catch (erro) {
      console.error(`${erro}: Erro na loadScreen`);
    }
  } 

  window.onload = () => {
  const clearButton = document.querySelector('.empty-cart');

    loadScreen();
    clearButton.addEventListener('click', clearCart);
};
