// Semelhante ao exemplo dado no dia 5.4
const localStorageKey = 'shopListSaved';

function saveShoppingCartList(shoppingCartItem) {
  if (localStorage.getItem(localStorageKey) === null) {
    localStorage.setItem(localStorageKey, JSON.stringify([]));
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.parentNode.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function getDataFromML(product) {
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`)
  .then((response) => response.json());
}

async function listProducts({ results }) {
  const items = document.querySelector('.items');

  results.forEach((obj) => {
    const prod = createProductItemElement({ sku: obj.id, name: obj.title, image: obj.thumbnail });
    
    items.appendChild(prod);
  });
  return results;
}

async function addToShoppingCart(products) {
  const addButtons = document.querySelectorAll('.item__add');
  const shopCart = document.querySelector('.cart__items');
  addButtons.forEach((element, idx) => element
  .addEventListener('click', async (_) => {
    await
    fetch(`https://api.mercadolibre.com/items/${products[idx].id}`)
      .then((requsition) => requsition.json())
      .then(({ id, title, price }) => {
        const shopListItem = { sku: id, name: title, salePrice: price };
        const shoppingCartItem = createCartItemElement(shopListItem);
        shopCart.appendChild(shoppingCartItem);
        saveShoppingCartList(shoppingCartItem);
      });
    }));
}

function loadLocalStorage() {
  const fullShoppingListSaved = localStorage.getItem(localStorageKey);
  const fullShoppingListSavedObj = JSON.parse(fullShoppingListSaved);
  const shopCart = document.querySelector('.cart__items');
  
  if (fullShoppingListSavedObj !== null) {
    fullShoppingListSavedObj.forEach((element) => {
      const item = document.createElement('li');
      item.innerHTML = element;
      shopCart.addEventListener('click', cartItemClickListener);
      shopCart.appendChild(item);
    });
  }
}
window.onload = () => {
  const product = 'computador';

  loadLocalStorage();
  getDataFromML(product)
  .then((productData) => listProducts(productData))
  .then((products) => addToShoppingCart(products));
 };
