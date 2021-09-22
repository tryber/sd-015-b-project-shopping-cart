const cartItems = document.querySelector('.cart__items');

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
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function removeItemLocalStorage(indexRemove) {
  const cartStorage = JSON.parse(localStorage.getItem('myCart'));
  if (!cartStorage) return;
  const newStorage = [];
  cartStorage.forEach((item, index) => {
    if (index !== indexRemove) {
      newStorage.push(item);
    }
  });
  localStorage.setItem('myCart', JSON.stringify(newStorage));
}

async function sumTotalCart() {
  const total = document.querySelector('.total-price');
  const productsSaveCart = await JSON.parse(localStorage.getItem('myCart'));
  const priceProducts = await productsSaveCart.map((product) => product.salePrice);
  const totalPriceProducts = await priceProducts
    .reduce((acc, current) => parseFloat(acc + current), 0);
  total.innerHTML = `${totalPriceProducts}`;
}

function cartItemClickListener(event) {
  event.target.classList.add('toRemoved');
  const cart = Array.from(cartItems.children);
  let initialIndex;
  cart.forEach((product, index) => {
    if (product.classList.contains('toRemoved')) {
      initialIndex = index;
    }
  });
  removeItemLocalStorage(initialIndex);
  sumTotalCart();
  cartItems.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function saveLocalStorage(product) {
  const mySavedCart = JSON.parse(localStorage.getItem('myCart'));
  mySavedCart.push(product);
  localStorage.setItem('myCart', JSON.stringify(mySavedCart));
}

async function addToCart(event) {
  try {
    const product = getSkuFromProductItem(event.target.parentNode);
    const url = `https://api.mercadolibre.com/items/${product}`;
    const myFetch = await fetch(url);
    const searchResult = await myFetch.json();
    const results = { 
      sku: searchResult.id, 
      name: searchResult.title, 
      salePrice: searchResult.price,
    };
    const returnedElement = createCartItemElement(results);
    cartItems.appendChild(returnedElement);
    saveLocalStorage(results);
    sumTotalCart();
  } catch (error) {
    console.log(error);
  }
}

function loadAddButton() {
  const addButton = document.querySelectorAll('.item__add');
  addButton.forEach((button) => button.addEventListener('click', (event) => {
    addToCart(event); 
    sumTotalCart();
  }));
}

async function createProductsList() {
  try {
    const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
    const myFetch = await fetch(url);
    const searchResult = await myFetch.json();
    const products = await searchResult.results;
    products.forEach(({ id, title, thumbnail }) => {
      const changeName = { sku: id, name: title, image: thumbnail };
      const x = createProductItemElement(changeName);
      const section = document.querySelector('.items');
      section.appendChild(x);
    });
    loadAddButton();
  } catch (error) {
    console.log(error);
  }
}

function initLocalStorage() {
  if (!localStorage.getItem('myCart'))localStorage.setItem('myCart', JSON.stringify([]));
  const actualStorage = JSON.parse(localStorage.getItem('myCart'));
  if (actualStorage[0]) {
    actualStorage.forEach((product) => {
    createCartItemElement(product);
    cartItems.appendChild(createCartItemElement(product));
    });
  }
}

window.onload = () => {
  createProductsList()
  .then(() => sumTotalCart());
  initLocalStorage();
};
