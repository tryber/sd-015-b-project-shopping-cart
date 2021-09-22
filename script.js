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
  console.log(event.target.id);
  localStorage.removeItem(event.target.id);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  const numberItem = localStorage.length;
  li.className = 'cart__item';
  li.id = `${numberItem + 1}-${sku}`;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

// consultando a resposta de Denis percebi que não estava 
// passando por que o teste rodava antes do carregamento do fecth
// então coloquei o fetch dentro de uma função e a chamei dentro window.onload
// https://github.com/tryber/sd-015-b-project-shopping-cart/pull/2/commits/c9ad5927fa9cd32f2d0146cc161f3af2cca44b6e
async function returnListMLB() {
return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${'computador'}`)
  .then((allInfo) => allInfo.json())
  .then((list) => list.results)
  .then((results) => results.forEach((computer) => {
      const product = document.querySelector('.items');
      product.appendChild(createProductItemElement(
        { sku: computer.id, name: computer.title, image: computer.thumbnail },
      )); 
  }))
  .then(() => document.querySelector('.loading').remove());
}

// async function sumPriceFromCart(idItem) {
//   fetch(`https://api.mercadolibre.com/items/${idItem}`)
//    .then((infoItem) => infoItem.json())
//    .then((itemData) => console.log(itemData.price)); 
// }

function getInputForCartItemElement(element) {
  let buttonSelected = element.target.className;
  if (buttonSelected === 'item__add') {
    buttonSelected = element.target.parentNode;
    const idFromItemSelected = getSkuFromProductItem(buttonSelected);
    fetch(`https://api.mercadolibre.com/items/${idFromItemSelected}`)
   .then((infoItem) => infoItem.json())
   .then((itemData) => {
 const dataFromInputElement = { sku: itemData.id, name: itemData.title, salePrice: itemData.price };
 const cart = document.querySelector('ol.cart__items');
 cart.appendChild(createCartItemElement(dataFromInputElement));
    // localStorage
    // .setItem('cart', JSON.stringify([`SKU: ${itemData.id} | NAME: ${itemData.title} | PRICE: $${itemData.price}`]));
});
}
}

function cleanCart() {
  const cart = document.querySelector('.cart__items');
  while (cart.firstChild) {
    cart.removeChild(cart.firstChild);
  }
  return localStorage.clear();
}

// requisito 4 - funções ainda em desenvolvimento
function createCartItemElementFromStorage(id, text) {
  const li = document.createElement('li');
    li.className = 'cart__item';
    li.id = id;
    li.innerText = text;
    return li;
}

function reloadCartItemFromStorage() {
  if (localStorage.length) {  
  for (let i = 0; i < localStorage.length; i += 1) {
    const liID = localStorage.key(i);
    const valueElementStorage = localStorage.getItem(localStorage.key(i));
    document.querySelector('ol.cart__items')
    .appendChild(createCartItemElementFromStorage(liID, valueElementStorage));    
  }
}
}

window.onload = () => {
  returnListMLB()
  .then(() => reloadCartItemFromStorage());
  document.addEventListener('click', ((element) => {
    const buttonSelected = element.target.className;
    if (buttonSelected === 'item__add') {
      return getInputForCartItemElement(element);
    }
    if (buttonSelected === 'empty-cart') {
      return cleanCart();
    }
    if (buttonSelected === 'cart__item') {
      return cartItemClickListener(element);
    }
  }));
};
