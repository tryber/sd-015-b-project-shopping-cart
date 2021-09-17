function load() {
  const loading = document.createElement('span');
  loading.classList.add('loading');
  loading.innerText = 'loading';
  document.body.appendChild(loading);
}

async function searchMercadoLivre() {
  load();
  const apiProducts = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const productsJson = await apiProducts.json();
  const loading = document.querySelector('.loading');
  loading.parentNode.removeChild(loading);
  return productsJson;
}

async function productMercadoLivre(id) {
  const apiProduct = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const productJson = await apiProduct.json();
  return productJson;
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

function updatePrice(price, operation) {
  // trapaça feia, pq usar o window.onload é muito chato
  const totalPrice = document.getElementsByClassName('total-price')[0];
  let total = 0;
  if (totalPrice.innerText) {
    total = parseFloat(totalPrice.innerText);
  }
  if (operation === 'sum') {
    total += price;
  }
  if (operation === 'sub') {
    total -= price;
  }
  totalPrice.innerText = total;
  localStorage.setItem('total', total);
}

// para que serve isso?
// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  const li = event.path[0];
  const ol = event.path[1];
  updatePrice(li.innerText.split('PRICE: $').pop(), 'sub');
  ol.removeChild(li);
  localStorage.setItem('content', ol.innerHTML);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addToList(id) {
  // mesma trapaça da linha 28
  const ol = document.getElementsByClassName('cart__items')[0];
  const { title, price } = await productMercadoLivre(id);
  const object = {
    sku: id,
    name: title,
    salePrice: price,
  };
  updatePrice(price, 'sum');
  const li = createCartItemElement(object);
  ol.appendChild(li);
  localStorage.setItem('content', ol.innerHTML);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', (() => addToList(sku)));
  section.appendChild(button);
  return section;
}

function addProducts({ id, title, thumbnail }) {
  const productElementItem = createProductItemElement({
    sku: id,
    name: title,
    image: thumbnail,
  });
  const items = document.querySelector('.items');
  items.appendChild(productElementItem);
}

function removeAll() {
  const ol = document.querySelector('.cart__items');
  const totalPrice = document.querySelector('.total-price');
  ol.innerHTML = '';
  totalPrice.innerHTML = '';
  localStorage.setItem('content', ol.innerHTML);
  localStorage.setItem('total', '');
}

window.onload = () => { 
  searchMercadoLivre().then((jsonData) => {
    const { results } = jsonData;
    results.forEach((result) => addProducts(result));
  });
  const ol = document.querySelector('.cart__items');
  const totalPrice = document.querySelector('.total-price');
  const emptyCart = document.querySelector('.empty-cart');
  emptyCart.addEventListener('click', removeAll);
  if (localStorage.getItem('content')) {
    ol.innerHTML = localStorage.getItem('content');
    totalPrice.innerText = localStorage.getItem('total');
    ol.addEventListener('click', cartItemClickListener);
  }
};
