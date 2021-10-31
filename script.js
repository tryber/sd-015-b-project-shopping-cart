const queryCart = '.cart__items';
const queryPrice = '.total-price';

const sumPrice = () => {
  const spanPrice = document.querySelector(queryPrice);
  const cart = document.querySelectorAll('.cart__item');

  let sum = 0;

  for (let i = 0; i < cart.length; i += 1) {
    const unitPriceItem = cart[i].getAttribute('price');
    sum += parseFloat(unitPriceItem);
  }
  spanPrice.innerHTML = `Total: $ ${sum.toFixed(2)}`;
};

const setItemsToLocalStorage = () => {
  const getOl = document.querySelector(queryCart);
  const getSpan = document.querySelector(queryPrice);
  localStorage.setItem('cart_items', getOl.innerHTML);
  localStorage.setItem('price', getSpan.innerHTML);
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function cartItemClickListener(event) {
  event.target.remove();
  sumPrice();
  setItemsToLocalStorage();
}

const getItemsFromLocalStorage = () => {
  const getOl = document.querySelector(queryCart);
  getOl.innerHTML = localStorage.getItem('cart_items');
  const getSpan = document.querySelector(queryPrice);
  getSpan.innerHTML = localStorage.getItem('price');
  getOl.addEventListener('click', cartItemClickListener);
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `NAME: ${name} | PRICE: $${salePrice}`;
  li.setAttribute('price', salePrice);
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addProductToCart = async (event) => {
  try {
    const productId = getSkuFromProductItem(event.target.parentElement);
    const fetchPromise = await fetch(`https://api.mercadolibre.com/items/${productId}`);
    const response = await fetchPromise.json();
    const { id, title, price} = response;
    const addCartProduct = createCartItemElement({ sku: id, name: title, salePrice: price });
    const getOl = document.querySelector(queryCart);
    getOl.appendChild(addCartProduct);
    sumPrice();
    setItemsToLocalStorage();
  } catch (error) {
    console.log(error);
  }
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (className === 'item__add') {
    e.addEventListener('click', sumPrice);
    e.addEventListener('click', setItemsToLocalStorage);
    e.addEventListener('click', addProductToCart);
  }
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

const loading = async () => {
  const getBody = document.querySelector('body');
  getBody.style.display = 'none';
  const getHtml = document.querySelector('html');
  const createSpan = document.createElement('span');
  createSpan.innerText = 'loading...';
  createSpan.className = 'loading';
  const getSpanLoading = document.querySelector('.loading');
  if (getHtml.contains(getSpanLoading)) {
    getHtml.removeChild(createSpan);
  } else {
    getHtml.appendChild(createSpan);
  }
};
const hideLoading = () => {
  const getBody = document.querySelector('body');
  getBody.style.display = 'block';
  const getSpanLoading = document.querySelector('.loading');
  getSpanLoading.remove();
};
const createListItems = async (query) => {
  try {
    loading();
    const fetchPromise = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
    const response = await fetchPromise.json();
    const { results } = response;
    results.forEach(({ id, title, thumbnail }) => {
      const objectToReturn = { sku: id, name: title, image: thumbnail };
      const createElement = createProductItemElement(objectToReturn);
      const getSection = document.querySelector('.items');
      getSection.appendChild(createElement);
    });
    setTimeout(hideLoading, 500);
  } catch (error) {
    console.log(error);
  }
};

const resetListItems = async (query) => {
  const getSection = document.querySelector('.items');
  getSection.innerHTML = '';
  await createListItems(query);
};

const searchInput = () => {
  const getButton = document.getElementById('search-btn');
  getButton.addEventListener('click', async (event) => {
    event.preventDefault();
    const getInput = document.getElementById('search-input');
    const query = getInput.value;
    if (query === '') {
      alert('Digite algo para pesquisar');
    } else {
     await resetListItems(query);
    }
  });
};

const emptyCart = () => {
  const getOl = document.querySelector(queryCart);
  getOl.innerHTML = '';
  sumPrice();
  setItemsToLocalStorage();
};
const handleEmptyCart = () => {
  const getEmptyButton = document.querySelector('.empty-cart');
  getEmptyButton.addEventListener('click', emptyCart);
};

const handleSearchButton = () => {
  const getSearchButton = document.getElementById('search-btn');
  getSearchButton.addEventListener('click', searchInput);
};

window.onload = () => {
  handleEmptyCart();
  handleSearchButton();
  searchInput();
  sumPrice();
  getItemsFromLocalStorage();
};
