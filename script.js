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
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// meu código
function addToCart(element) {
  const cartItems = document.querySelector('.cart__items');
  element.lastChild.addEventListener('click', () => {
    fetch(`https://api.mercadolibre.com/items/${element.firstChild.innerText}`)
    .then((response) => response.json())
    .then(({ id, title, price }) => { 
      const createCartItem = createCartItemElement({ sku: id, name: title, salePrice: price });
      console.log(cartItems);
      cartItems.appendChild(createCartItem);
    });
  });
}

async function requestAPi() {
  const section = document.querySelector('.items');
  const fetchApi = fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const response = await fetchApi;
  const productList = await response.json();
  return productList.results.forEach(({ id, title, thumbnail }) => {
    const createElement = createProductItemElement({ sku: id, name: title, image: thumbnail });
    section.appendChild(createElement);
    addToCart(createElement);
  });
}

window.onload = () => {
  requestAPi();
 };
