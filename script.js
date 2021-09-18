const local = localStorage;
const ordenedlistCart = document.querySelector('ol.cart__items');
const buttonEmptyCart = document.querySelector('button.empty-cart');
const loadingScreanInit = document.getElementsByClassName('loading')[0];
const loadingScreanList = document.getElementsByClassName('loading')[1];

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

async function itemObjectPromise(id) {
  loadingScreanList.innerText = 'loading...';
  return fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((result) => result.json())
    .then((resultJson) => {
      loadingScreanList.innerText = '';
      return resultJson;
    });
}

function cartListInArray() {
  const cartListElements = ordenedlistCart.children;
  const cartListArray = Object.values(cartListElements).map((element) => element.innerText);
  return cartListArray;
}

function calculateTotal() {
  const cartListArray = cartListInArray();
  let total = cartListArray.reduce((acc, curr) => {
    const valueCurr = parseFloat(curr.split(' PRICE: $')[1]);
    return acc + valueCurr;
  }, 0);
  total = total.toFixed(2);
  const totalElement = document.querySelector('span span.total-price');
  totalElement.innerText = total;
}

function addCartToLocalStorage() {
  const cartListArray = cartListInArray();
  local.setItem('cartList', JSON.stringify(cartListArray));
  calculateTotal();
}

function cartItemClickListener(event) {
  const element = event.target;
  element.parentNode.removeChild(element);
  addCartToLocalStorage();
}

function addLocalStorageToCart() {
  if (local.getItem('cartList')) {
    const cartList = JSON.parse(local.getItem('cartList'));
    cartList.forEach((element) => {
     const li = document.createElement('li');
     li.className = 'cart__item';
     li.innerText = element;
     li.addEventListener('click', cartItemClickListener);
     ordenedlistCart.appendChild(li);
    });
   }
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addElementToCart(event) {
  const element = event.target.parentNode;
  const elementId = getSkuFromProductItem(element);
  itemObjectPromise(elementId)
    .then((object) => {
      const { id: sku, title: name, price: salePrice } = object;
      const listItem = createCartItemElement({ sku, name, salePrice });
      ordenedlistCart.appendChild(listItem);
      addCartToLocalStorage();
    });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.lastChild.addEventListener('click', addElementToCart);
  return section;
}

const computersArrayPromise = new Promise((resolve, _) => {
  loadingScreanInit.innerText = 'loading...';
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((result) => result.json())
    .then((resultJson) => {
      loadingScreanInit.innerText = '';
      return resolve(resultJson.results);
    });
});

function emptyCart() {
  const arrayElementsLi = ordenedlistCart.children;
  Object.keys(arrayElementsLi).forEach((_) => {
    ordenedlistCart.removeChild(ordenedlistCart.lastChild);
  });
  addCartToLocalStorage();
}

buttonEmptyCart.addEventListener('click', emptyCart);

window.onload = () => {
  const sectionItemsElement = document.querySelector('section.items');
  addLocalStorageToCart();
  calculateTotal();
  computersArrayPromise
    .then((results) => {
      results.forEach((element) => {
        const { id: sku, title: name, thumbnail: image } = element;
        const newElement = createProductItemElement({ sku, name, image });
        sectionItemsElement.appendChild(newElement);
      });
    });
};
