const cartItemsOl = '.cart__items';
const priceContainer = '.total-price';

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const saveCartLocalStorage = () => {
  const cartItems = document.querySelector(cartItemsOl);

  localStorage.setItem('myCart', cartItems.innerHTML);
};

const sumPrices = () => {
  let sum = 0;
  const totalPrice = document.querySelector(priceContainer);
  const itemsList = document.getElementsByClassName('cart__item');

  for (let i = 0; i < itemsList.length; i += 1) {
    const price = itemsList[i].getAttribute('price');
    sum += parseFloat(price);
  }

  if (sum === 0) {
    totalPrice.style.display = 'none';
  } else {
    totalPrice.style.display = 'inline';
    totalPrice.innerText = sum;
  }
};

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();

  sumPrices();
  saveCartLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.setAttribute('price', salePrice);
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchAPI = async (url) => (await fetch(url)).json();

const addToCartEndpoint = async (event) => {
  const currentProduct = event.target.parentElement;
  const itemId = getSkuFromProductItem(currentProduct);
  const url = `https://api.mercadolibre.com/items/${itemId}`;

  try {
    const { id: sku, title: name, price: salePrice } = await fetchAPI(url);
    const cartItems = document.querySelector(cartItemsOl);
    const selectedProduct = createCartItemElement({ sku, name, salePrice });

    cartItems.append(selectedProduct);
    sumPrices();
    saveCartLocalStorage();
  } catch (e) {
    console.log('Error!!!');
    console.log(e);
  }
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;

  if (className === 'item__add') e.addEventListener('click', addToCartEndpoint);

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

const loadingScreen = () => {
  const mainContainer = document.querySelector('.container');
  const body = document.querySelector('body');
  const div = document.createElement('div');

  mainContainer.style.display = 'none';
  div.innerText = 'loading...';
  div.className = 'loading';
  body.append(div);
};

const reloadScreen = () => {
  const mainContainer = document.querySelector('.container');
  const div = document.querySelector('.loading');

  div.remove();
  mainContainer.style.display = 'flex';
};

const createItemProductSection = async () => {
  loadingScreen();

  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  try {
    const { results } = await fetchAPI(url);
    const itemsSection = document.querySelector('.items');
    
    results.forEach(({ id, title, thumbnail }) => {
      const itemToRender = createProductItemElement({ sku: id, name: title, image: thumbnail });

      itemsSection.append(itemToRender);
    });
  } catch (e) {
    console.log('Error!!!');
    console.log(e);
  }
  reloadScreen();
};

const emptyCart = () => {
  const listedCartItems = document.querySelector(cartItemsOl);

  listedCartItems.innerHTML = '';

  sumPrices();
  localStorage.clear();
};

const restoreCartStorage = () => {
  const listedCartItems = document.querySelector(cartItemsOl);

  const myCartStorage = localStorage.getItem('myCart');

  listedCartItems.innerHTML = myCartStorage;
  listedCartItems.addEventListener('click', cartItemClickListener);
  sumPrices();
};

window.onload = () => {
  createItemProductSection();
  restoreCartStorage();

  const emptyCartButton = document.querySelector('.empty-cart');
  emptyCartButton.addEventListener('click', emptyCart);
};
