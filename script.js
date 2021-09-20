function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(event) {
  const clicked = event.target;
  clicked.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addCartItem(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => response.json())
  .then((data) => {
    const { id: sku, title: name, price: salePrice } = data;
    const ol = document.querySelector(".cart__items");
    ol.appendChild(createCartItemElement({ sku, name, salePrice }));
  });
}
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (e.tagName === 'BUTTON') {
    e.addEventListener('click', (event) => addCartItem(event.target.id));
  }
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.id = sku;
  section.appendChild(button);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function getProducts() {
  fetch("https://api.mercadolibre.com/sites/MLB/search?q=computador")
  .then((response) => response.json())
  .then((data) => data.results.forEach((computer) => {
    const { id: sku, title: name, thumbnail: image } = computer;
    const products = document.getElementsByClassName('items');
    products[0].appendChild(createProductItemElement({ sku, name, image }));
  }));
}

window.onload = () => {
  getProducts();
};
