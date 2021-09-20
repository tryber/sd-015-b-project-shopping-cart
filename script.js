const cartItens = '.cart__items';
// Semelhante ao exemplo dado no dia 5.4
const localStorageKey = 'shopListSaved';
let totalPriceValue = 0;

function saveShoppingCartList(shoppingCartItem) {
  if (localStorage.getItem(localStorageKey) === null) {
    localStorage.setItem(localStorageKey, JSON.stringify([]));
  }
  if (localStorage.getItem(localStorageKey).length < 1) {
    localStorage.setItem(localStorageKey, JSON.stringify(totalPriceValue));
  }
  const oldList = JSON.parse(localStorage.getItem(localStorageKey));
  oldList.push(shoppingCartItem.innerText);
  localStorage.setItem(localStorageKey, JSON.stringify(oldList));
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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// Fonte: https://stackoverflow.com/questions/3650081/why-does-the-sum-of-2-parsefloat-variables-give-me-an-incorrect-decimal-number 
// Fonte: https://stackoverflow.com/questions/3612744/remove-insignificant-trailing-zeros-from-a-number
function changeShowPriceDisplay(display) {
  const showPrice = document.querySelector('.show-price');
  showPrice.style.display = display;
}

function updateTotalPrice(price) {
  const totalPrice = document.querySelector('.total-price');
  totalPriceValue += parseFloat(price.toFixed(4));
  totalPrice.innerHTML = totalPriceValue.toFixed(2).replace(/\.0+|0+$/, '');
  changeShowPriceDisplay('flex');
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.parentNode.removeChild(event.target);
  saveShoppingCartList(event);
  // const itemPrice = parseFloat(event.target.innerHTML.split('$')[1]);
  let itemPrice = event.target.innerHTML.split('$');
  itemPrice = parseFloat(itemPrice[itemPrice.length - 1]);

  updateTotalPrice(-itemPrice);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function getDataUsingFetch(link) { 
  return fetch(link).then((response) => response.json());
}

function addLoading() {
  const loading = document.createElement('p');
  const cart = document.querySelector(cartItens);
  loading.className = 'loading';
  loading.innerHTML = 'loading...';
  cart.appendChild(loading);
}

function removeLoading() {
  const loading = document.querySelector('.loading');
  const cart = document.querySelector(cartItens);
  cart.removeChild(loading);
}

async function getDataFromML(product) {
  return getDataUsingFetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`);
}

async function listProducts({ results }) {
  const items = document.querySelector('.items');

  results.forEach((obj) => {
    const prod = createProductItemElement({ sku: obj.id, name: obj.title, image: obj.thumbnail });
    
    items.appendChild(prod);
  });
  return results;
}

function addShoppingCartItem(id, title, price, shopCart) {
  const shopListItem = { sku: id, name: title, salePrice: price };
        const shoppingCartItem = createCartItemElement(shopListItem);
        shopCart.appendChild(shoppingCartItem);
        saveShoppingCartList(shoppingCartItem);
}

async function addToShoppingCart(products) {
  const addButtons = document.querySelectorAll('.item__add');
  const shopCart = document.querySelector(cartItens);
  addButtons.forEach((element, idx) => element
  .addEventListener('click', async (_) => {
    addLoading();
    await
    getDataUsingFetch(`https://api.mercadolibre.com/items/${products[idx].id}`)
      .then(({ id, title, price }) => {
        addShoppingCartItem(id, title, price, shopCart);
        updateTotalPrice(price);
      });
    removeLoading();
    }));
}

function loadLocalStorage() {
  const fullShoppingListSaved = localStorage.getItem(localStorageKey);
  const fullShoppingListSavedObj = JSON.parse(fullShoppingListSaved);
  const shopCart = document.querySelector(cartItens);
  
  if (fullShoppingListSavedObj !== null) {
    fullShoppingListSavedObj.forEach((element) => {
      const item = document.createElement('li');
      item.innerHTML = element;
      shopCart.addEventListener('click', cartItemClickListener);
      shopCart.appendChild(item);
    });
  }
}

function clearShoppingCart() {
  const clearButton = document.querySelector('.empty-cart');
  const list = document.querySelector(cartItens);
  const totalPrice = document.querySelector('.total-price');

  clearButton.addEventListener('click', (_) => {
    localStorage.clear();
    list.innerHTML = '';
    totalPrice.innerHTML = '';
    totalPriceValue = 0;
    changeShowPriceDisplay('none');
  });
}

window.onload = () => {
  const product = 'computador';

  loadLocalStorage();
  addLoading();
  getDataFromML(product)
  .then((productData) => {
    removeLoading();
    return listProducts(productData);
  })
  .then((products) => addToShoppingCart(products));

  clearShoppingCart();
 };
