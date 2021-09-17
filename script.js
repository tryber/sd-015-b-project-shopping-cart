function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getProductIdByButton(button) {
  const productButton = button;
  const productElement = productButton.parentElement;
  const productId = getSkuFromProductItem(productElement);
  return productId;
}

async function addToCartClickListener(event) {
  const productId = getProductIdByButton(event.target);
  const ENDPOINT = `https://api.mercadolibre.com/items/${productId}`;

  const response = await fetch(ENDPOINT);
  const { id: sku, title: name, price: salePrice } = await response.json();

  const cart = document.querySelector('.cart__items');
  const cartItemElement = createCartItemElement({ sku, name, salePrice });
  cart.appendChild(cartItemElement);

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
  if (className === 'item__add') e.addEventListener('click', addToCartClickListener);
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

function appendProduct({id:sku, title:name, thumbnail: image}) {
  const itemsSection = document.querySelector('.items');
  const productElement = createProductItemElement({sku, name, image});
  itemsSection.appendChild(productElement);
}

function appendProducts(productsJson) {
  productsJson.forEach((product) => {
    appendProduct(product);
  });
}

async function fetchProducts(product = 'computador') {
  const ENDPOINT = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
  try {
    const response = await fetch(ENDPOINT);
    const { results } = await response.json();
    appendProducts(results);
    console.log(results);
  } catch (e) {
    console.error(e);
  }
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const product = event.target();

}



window.onload = () => {   
  fetchProducts(); 
};
