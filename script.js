const cartItemsOl = '.cart__items';
const priceContainer = '.total-price';

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function getSkuFromProductItem(item) {
  return item.querySelector('p.item__sku').innerText;
}

const saveCartLocalStorage = () => {
  const cartItems = document.querySelector(cartItemsOl);

  localStorage.setItem('myCart', cartItems.innerHTML);
};

const sumPrices = () => {
  let sum = 0;
  const totalPrice = document.querySelector(priceContainer);
  const totalParagraph = document.getElementById('total-value');
  const itemsList = document.getElementsByClassName('cart__item');
  const itemsQuantity = document.querySelector('.quantity');
  itemsQuantity.innerText = itemsList.length;

  for (let i = 0; i < itemsList.length; i += 1) {
    const price = itemsList[i].getAttribute('price');
    sum += parseFloat(price);
  }

  if (sum === 0) {
    totalParagraph.style.display = 'none';
  } else {
    totalParagraph.style.display = 'inline';
    totalPrice.innerText = sum.toFixed(2);
  }
};

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();

  sumPrices();
  saveCartLocalStorage();
}

function createCartItemElement({ name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerHTML = `${name} <b>Valor: R$ ${salePrice}</b>`;
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

function createProductItemElement({ sku, name, image, price }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('p', 'item__sku', sku));
  section.appendChild(createCustomElement('p', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('p', 'item__price', `R$: ${price.toFixed(2)}`));
  section.appendChild(createCustomElement('button', 'item__add', 'COMPRAR'));

  return section;
}

const loadingScreen = () => {
  const mainContainer = document.querySelector('.container');
  const body = document.querySelector('body');
  const loadingContainer = document.createElement('div');
  const loadingText = document.createElement('span');

  mainContainer.style.display = 'none';
  loadingContainer.className = 'loading-container';
  for (let i = 0; i <= 2; i += 1) {
    const circle = document.createElement('div');
    const shadow = document.createElement('div');
    circle.className = `circle circle${i}`;
    shadow.className = `shadow shadow${i}`;
    loadingContainer.append(circle);
    loadingContainer.append(shadow);
  }
  loadingText.innerText = 'LOADING';
  loadingContainer.append(loadingText);
  body.appendChild(loadingContainer);
};

const reloadScreen = () => {
  setTimeout(() => {
    const mainContainer = document.querySelector('.container');
    const div = document.querySelector('.loading-container');

    div.remove();
    mainContainer.style.display = 'flex';
  }, 200);
};

const getUserSearch = () => {
  const itemsSection = document.querySelector('.items');
  itemsSection.innerHTML = '';

  const userSearch = document.querySelector('.input-search').value;
  return userSearch || 'computador';
};

const createItemProductSection = async () => {
  loadingScreen();
  const userSearch = getUserSearch();
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${userSearch}`;
  try {
    const itemsSection = document.querySelector('.items');
    const { results } = await fetchAPI(url);

    results.forEach(({ id, title, thumbnail, price }) => {
      const itemToRender = createProductItemElement(
        { sku: id, name: title, image: thumbnail, price },
      );
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

  const userSearch = document.querySelector('.input-search');
  userSearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') createItemProductSection();
  });

  const myCart = document.querySelector('#my-cart');
  myCart.addEventListener('click', () => {
    const cartSection = document.querySelector('.cart');
    cartSection.classList.toggle('active-section');
  });
};
