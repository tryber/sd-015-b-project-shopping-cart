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

function cartItemClickListener() {
    const ul = document.querySelector('.cart__items');
    const li = this;
    ul.removeChild(li);
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
    const cartItem = document.querySelector('.cart__items');
    cartItem.appendChild(createCartItemElement(
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
    .catch((erro) => console
    .error(`${erro}: Possivelmente erro no link da API`));
  }

window.onload = () => {
    findItems('computador');
};
