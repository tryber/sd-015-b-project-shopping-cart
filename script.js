const local = localStorage;
const ordenedlistCart = document.querySelector('ol.cart__items');
const buttonEmptyCart = document.querySelector('button.empty-cart');

function createLoadingScreanToInit() {
  if (!document.querySelector('.loading')) {
    const element = document.createElement('span');
    element.className = 'loading';
    element.innerText = 'loading...';
    document.body.prepend(element);
  }
}

function createLoadingScreanToList() {
  if (!document.querySelector('.loading')) {
    const element = document.createElement('span');
    element.className = 'loading';
    element.innerText = 'loading...';
    document.querySelector('section.cart').appendChild(element);
  }
}

function closeListLoadingScrean() {
  const element = document.querySelector('section.cart span.loading');
  document.querySelector('section.cart').removeChild(element);
}

async function itemObjectPromise(id) {
  createLoadingScreanToList();
  return fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((result) => result.json())
    .then((resultJson) => {
      closeListLoadingScrean();
      return resultJson;
    });
}

function closeInitLoadingScrean() {
  const element = document.querySelector('body span.loading');
  document.body.removeChild(element);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createpopupElement({ sku, salePrice }) {
  const span = document.createElement('span');
  span.id = 'cart__popup';
  const container = document.createElement('div');
  const ul = document.createElement('ul');
  const liId = document.createElement('li');
  const liPrice = document.createElement('li');
  liId.innerText = `id: ${sku}`;
  liPrice.innerText = `Price: $${salePrice.toFixed(2)}`;
  ul.appendChild(liId);
  ul.appendChild(liPrice);
  container.appendChild(ul);
  span.appendChild(container);
  return span;
}

function showHidePopupElement(event) {
  const element = event.target.parentNode;
  const elementId = getSkuFromProductItem(element);
  itemObjectPromise(elementId)
    .then((object) => {
      const { id: sku, price: salePrice } = object;
      if (!element.querySelector('#cart__popup')) {
        const popup = createpopupElement({ sku, salePrice });
        element.appendChild(popup);
        element.nextSibling.style.zIndex = '-1';
      } else {
        element.removeChild(element.querySelector('#cart__popup'));
        element.nextSibling.style.zIndex = '0';
      }
    });
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  img.addEventListener('mouseover', showHidePopupElement);
  img.addEventListener('mouseout', showHidePopupElement);
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
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
  total = parseFloat(total.toFixed(2));
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
  section.querySelector('img').alt = `${name} | ${image}`;
  return section;
}

const computersArrayPromise = new Promise((resolve, _) => {
  createLoadingScreanToInit();
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((result) => result.json())
    .then((resultJson) => {
      closeInitLoadingScrean();
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
