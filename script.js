const cardItemsElement = document.querySelector('.cart__items');
const search = document.querySelector('.input-group-prepend');
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const saveCardStorage = (htmlContent) => {
  const localStoragePrice = document.querySelector('.total-price').innerText;
  localStorage.setItem('totalprice', localStoragePrice);
  localStorage.setItem('html', htmlContent);
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerHTML = innerText;
  return e;
}

function createProductItemElement({ sku, name, image, priceItem }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item_price', `R$ ${priceItem}`));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add btn btn-success',
   '<i class="bi bi-cart-plus"></i>'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const indexPrice = event.target.innerText.indexOf('$');
  const lastIndex = event.target.innerText.length;
  const price = Math.round(parseFloat(event
    .target.innerText.slice(indexPrice + 1, lastIndex)) * 100) / 100;
  const totalPrice = document.querySelector('.total-price');
  const oldPrice = Math.round(parseFloat(totalPrice.innerText) * 100) / 100;
  totalPrice.innerText = (oldPrice - price).toFixed(2);
  localStorage.setItem('totalprice', totalPrice.innerText);
  event.target.remove();
  const htmlCard = cardItemsElement.innerHTML;
  saveCardStorage(htmlCard);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getProductsArray = async (product = 'computador') => {
  const generalURL = 'https://api.mercadolibre.com/sites/MLB/search?q=$QUERY';
  const link = generalURL.replace(/QUERY/i, product);
  try {
    const products = await fetch(link)
    .then((binResult) => binResult.json())
    .then((productsObj) => productsObj.results);
    products.forEach(({ id, title, thumbnail, price }) => {
    const objecReturn = { sku: id, name: title, image: thumbnail, priceItem: price };
    const element = createProductItemElement(objecReturn);
    document.querySelector('.items').appendChild(element);
    });
  } catch (error) {
    console.error(error);
  }
};

const sumCardPrice = async (price) => {
  const priceHTML = document.getElementById('tprice');
  const priceShow = parseFloat(priceHTML.innerText) + price;
  priceHTML.innerText = priceShow.toFixed(2);
};

const addToCart = async (e) => {
  if (e.target.className === 'item__add btn btn-success') {
    const idProduct = e.target.parentElement.firstChild.innerText;
    const link = `https://api.mercadolibre.com/items/${idProduct}`;
    try {
      const productIdObj = await fetch(link)
        .then((binProduct) => binProduct.json())
        .then((objProduct) => objProduct);
      const { id, title, price } = productIdObj;
      sumCardPrice(price);
      const productToCard = { sku: id, name: title, salePrice: price };
      const cardElements = createCartItemElement(productToCard);
      cardItemsElement.appendChild(cardElements);
      const htmlCard = cardItemsElement.innerHTML;
      saveCardStorage(htmlCard);
    } catch (err) { console.log(err); }
  }
};

const createLoadingContent = () => {
  const loading = document.createElement('div');
  const loading2 = document.createElement('div');
  const loading3 = document.createElement('div');
  'LOADING...'.split('').forEach((letter, i) => {
    const span = document.createElement('span');
    span.style = `--a:${i + 1}`;
    span.innerText = letter;
    loading3.appendChild(span);
  });
  loading.className = 'loading';
  loading2.className = 'loading-child1';
  loading3.className = 'loading-child2';
  loading.appendChild(loading2);
  loading.appendChild(loading3);
  document.querySelector('.items').appendChild(loading);
};

const loadingfc = async (product) => {
  try {
    const time = Math.floor(Math.random() * (1500 - 1000) + 1000);
    document.querySelector('.items').innerHTML = '';
    createLoadingContent();
    setTimeout(() => getProductsArray(product)
    .then(document.querySelector('.loading').remove()), time);
  } catch (err) { console.error(err); }
};

const clearCard = () => {
  cardItemsElement.innerHTML = '';
  document.getElementById('tprice').innerText = 0;
  saveCardStorage('');
};

const searchFc = (event) => {
  const product = document.querySelector('.form-control').value;
  loadingfc(product);
};

window.onload = () => {
loadingfc();
if (localStorage.getItem('totalprice') === '' || !localStorage.getItem('totalprice')) {
  localStorage.setItem('totalprice', 0);
}
document.getElementById('tprice').innerText = localStorage.getItem('totalprice');
cardItemsElement.innerHTML = localStorage.getItem('html');
const liLocalStorage = document.getElementsByClassName('cart__item');
for (let i = 0; i < liLocalStorage.length; i += 1) {
  liLocalStorage[i].addEventListener('click', cartItemClickListener);
}
document.querySelector('.empty-cart').addEventListener('click', clearCard);
document.addEventListener('click', addToCart);
search.addEventListener('click', searchFc);
};
