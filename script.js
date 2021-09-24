function getTotalPrice() {
  return document.querySelector('.total-price');
}

function sum(current, total) {
  return total + current;
}

function sub(current, total) {
  return current - total;
}

function totalChartPrice(item, operation) {
  const totalPrice = getTotalPrice(); 
  const total = totalPrice.innerText;
  const count = operation(Number(total), Number(item));
  totalPrice.innerText = count;
  localStorage.setItem('chartTotal', count);
}

function saveToStorage() {
  const chartItens = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('chart', chartItens);
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

// Para que serve isso ?
// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  event.target.remove();
  saveToStorage();
  totalChartPrice(event.target.innerText.split('PRICE: $').pop(), sub);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// meu código
function storageChart() {
  if (!localStorage.chart) { return; }
  const chartItens = document.querySelector('ol');
  chartItens.innerHTML = localStorage.chart;
  for (let i = 0; i < chartItens.children.length; i += 1) {
    const element = chartItens.children[i];
    element.addEventListener('click', cartItemClickListener);
  }
}

function addToCart(element) {
  const cartItems = document.querySelector('.cart__items');
  element.lastChild.addEventListener('click', () => {
    fetch(`https://api.mercadolibre.com/items/${element.firstChild.innerText}`)
    .then((response) => response.json())
    .then(({ id, title, price }) => { 
      const createCartItem = createCartItemElement({ sku: id, name: title, salePrice: price });
      cartItems.appendChild(createCartItem);
      saveToStorage();
      totalChartPrice(createCartItem.innerText.split('PRICE: $').pop(), sum);
    });
  });
}

async function requestAPi() {
  const section = document.querySelector('.items');
  const loading = document.createElement('span');
  loading.className = 'loading';
  loading.innerText = 'loading';
  section.appendChild(loading);
  const fetchApi = fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const response = await fetchApi;
  const productList = await response.json();
  loading.remove();
  return productList.results.forEach(({ id, title, thumbnail }) => {
    const createElement = createProductItemElement({ sku: id, name: title, image: thumbnail });
    section.appendChild(createElement);
    addToCart(createElement);
  });
}

function setTotalChartStorage() {
  if (!localStorage.chart) { return; }
  const chart = getTotalPrice();
  chart.innerText = localStorage.chartTotal;
}

function resetCart() {
  const totalPrice = getTotalPrice();
  const totalCart = document.getElementsByClassName('cart__items')[0];
  totalPrice.innerText = 0;
  localStorage.setItem('chartTotal', 0);
  localStorage.removeItem('chart');
  totalCart.innerHTML = '';
}

window.onload = () => {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', resetCart);
  setTotalChartStorage();
  storageChart();
  requestAPi();
 };
