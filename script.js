const Query = 'computador';
const API_URL = `https://api.mercadolibre.com/sites/MLB/search?q=${Query}`;

const cartList = document.querySelector('.cart__items');
const sumPlace = document.querySelector('.total-price');
console.log(sumPlace);
const cartPrice = [];

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
// requisito 3
// function cartItemClickListener() {
//  this.remove();
//  sumCart();
// }
// requisito 5
// function sumCart(priceItem) {
//    const sum = priceItem.reduce((acc, curr) => acc + curr);
//    sumPlace.innerText = `${sum}`;
// }

function sumCart() {
  const arrayCartItems = [...document.querySelectorAll('.cart__item')];
  console.log(arrayCartItems);
  const arrayPrice = arrayCartItems.map((cartItem) => {
    const resultSplited = cartItem.innerText.split('$')[1];
    const numberConvert = parseFloat(resultSplited, 10);
    return numberConvert;
  });
  const finalSum = arrayPrice.reduce((acc, curr) => acc + curr, 0);
  sumPlace.innerText = `${finalSum}`;
}

function cartItemClickListener() {
  this.remove();
  sumCart();
 }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// requisito 2 
const startButtonAddCart = () => {
  const arrayButtons = document.querySelectorAll('.item__add');
  arrayButtons.forEach((button) => button.addEventListener('click', () => {
    const sectionElement = button.closest('section');
    const idItem = getSkuFromProductItem(sectionElement);
    fetch(`https://api.mercadolibre.com/items/${idItem}`)
      .then((response) => response.json())
      .then((data) => createCartItemElement(
        { sku: data.id, name: data.title, salePrice: data.price },
      ))
      .then((cartItem) => cartList.appendChild(cartItem))
      .then(() => sumCart());
  }));
};
// requisito 6
function clearCartItems() {
  const buttonCart = document.querySelector('.empty-cart');
  buttonCart.addEventListener('click', () => {
    const items = cartList;
    items.innerHTML = '';
  });
}
// requisito 7
function addClassLoading() {
  const sectionLoading = document.querySelector('.loading-message');
  sectionLoading.classList.add('loading');
}
// requisito 7
function removeClassList() {
  const sectionLoading = document.querySelector('.loading-message');
  sectionLoading.classList.remove('loading');
  sectionLoading.remove();
}
// requsito 1
async function callApi(url) {
  return fetch(url)
  .then((response) => response.json())
  .then((data) => data.results.forEach(({ id, title, thumbnail }) => {
    const computerObj = {
      sku: id,
      name: title,
      image: thumbnail,
     };
     const sessaoItems = document.querySelector('.items');
     const produtoCriado = createProductItemElement(computerObj);
     sessaoItems.appendChild(produtoCriado);
  }));
}

window.onload = () => {
  addClassLoading();
  callApi(API_URL)
  .then(() => removeClassList())
  .then(() => startButtonAddCart())
  .then(() => clearCartItems());
};
