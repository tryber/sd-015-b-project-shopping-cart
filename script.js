const cardItemsElement = document.querySelector('.cart__items');
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
  const indexPrice = event.target.innerText.indexOf('$');
  const lastIndex = event.target.innerText.length;
  const price = parseFloat(event.target.innerText.slice(indexPrice + 1, lastIndex)).toFixed(2);
  const totalPrice = document.querySelector('.total-price');
  const oldPrice = parseFloat(totalPrice.innerText).toFixed(2);
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
    products.forEach(({ id, title, thumbnail }) => {
    const objecReturn = { sku: id, name: title, image: thumbnail };
    const element = createProductItemElement(objecReturn);
    document.querySelector('.items').appendChild(element);
    });
  } catch (error) {
    console.error(error);
  }
  };

  const sumCardPrice = async (price) => {
    const priceHTML = document.getElementById('tprice');
    priceHTML.innerText = (parseFloat(priceHTML.innerText) + price).toFixed(2);
  };

  const addToCart = async (e) => {
    if (e.target.className === 'item__add') {
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

  const clearCard = () => {
    cardItemsElement.innerHTML = '';
    document.getElementById('tprice').innerText = 0;
    saveCardStorage('');
  };

  window.onload = () => {
  getProductsArray();
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
};
