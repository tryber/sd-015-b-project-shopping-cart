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

const getFetch = (url, onSucess, onFail) => {
  fetch(url)
    .then((response) => response.json())
    .then((response) => onSucess(response))
    .catch((error) => onFail(error));
};

async function getProductList(url, product, onSucess, onFail) {
  try {
    const urlSearch = `${url}${product}`;
    return await getFetch(urlSearch, onSucess, onFail);
  } catch (error) {
    console.log(`Erro encontrado no bloco getProductList(): ${error}`);
  }
}

const formatItemListProducts = (sku, name, image) =>
  ({ sku, name, image });

const appendProductItem = (target, element) =>
  target.appendChild(createProductItemElement(element));

const getLocalStorage = () =>
  JSON.parse(localStorage.getItem('ShoppingCartProject'));

const verifyLocalStorage = () => {
  let myStorage = getLocalStorage();
  if (!myStorage) {
    myStorage = [];
  }
  return myStorage;
};

const createFieldTotalPrice = () => {
  const parent = document.getElementsByClassName('cart')[0];
  const divTotalPrice = document.createElement('div');
  divTotalPrice.className = 'div-total-price';
  const LabelTotalPrice = document.createElement('span');
  LabelTotalPrice.innerText = 'Preço total: $';
  const fieldTotalPrice = document.createElement('span');
  fieldTotalPrice.className = 'total-price';
  fieldTotalPrice.innerText = '0';
  parent.appendChild(divTotalPrice);
  divTotalPrice.appendChild(LabelTotalPrice);
  divTotalPrice.appendChild(fieldTotalPrice);
};

const updateTotalPrice = () => {
  const totalPrice = document.getElementsByClassName('total-price')[0];
  const myStorage = verifyLocalStorage();
  totalPrice.innerText = myStorage.reduce((acc, storage) => acc + storage.price, 0);
};

const setLocalStorage = (sku, name, price) => {
  const myStorage = verifyLocalStorage();
  myStorage.push({ sku, name, price });
  localStorage.setItem('ShoppingCartProject', JSON.stringify(myStorage));
};

const removeItemLocalStorage = (sku) => {
  let myStorage = verifyLocalStorage();
  myStorage = myStorage.filter((storage) => storage.sku !== sku);
  localStorage.setItem('ShoppingCartProject', JSON.stringify(myStorage));
};

const setItensOnPage = (response) => {
  const itens = [];
  response.results.forEach((res) =>
    itens.push(formatItemListProducts(res.id, res.title, res.thumbnail)));
  const mySection = document.getElementsByClassName('items')[0];
  itens.forEach((element) => appendProductItem(mySection, element));
};

function cartItemClickListener(event) {
  const parent = event.target.parentElement;
  parent.removeChild(event.target);
  removeItemLocalStorage(event.target.innerText.split('|')[0].split(':')[1].trim());
  updateTotalPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const formatItemListCart = (sku, name, salePrice) =>
  ({ sku, name, salePrice });

const setItensOnCart = (response) => {
  const mySection = document.getElementsByClassName('cart__items')[0];
  mySection.appendChild(createCartItemElement(formatItemListCart(response.id,
    response.title, response.price)));
  setLocalStorage(response.id, response.title, response.price);
  updateTotalPrice();
};

const updateCartOnLoadPage = () => {
  const myStorage = verifyLocalStorage();
  const mySection = document.getElementsByClassName('cart__items')[0];
  myStorage.forEach((storage) => {
  mySection.appendChild(createCartItemElement(formatItemListCart(storage.sku,
    storage.name, storage.price)));
  });
  updateTotalPrice();
};

const getProductSelected = (event) => {
  if (event.target.className === 'item__add') {
    const itemSku = getSkuFromProductItem(event.target.parentElement);
    const url = 'https://api.mercadolibre.com/items/';
    getProductList(url, itemSku, setItensOnCart, console.log);
  }
};

const getClickAddButton = () => {
  const items = document.getElementsByClassName('items')[0];
  items.addEventListener('click', getProductSelected);
};

const cleanCart = () => {
  const cartItems = document.getElementsByClassName('cart__items')[0];
  cartItems.innerHTML = '';
  localStorage.removeItem('ShoppingCartProject');
  updateCartOnLoadPage();
};

const clickCleanCart = () => {
  const emptyCart = document.getElementsByClassName('empty-cart')[0];
  emptyCart.addEventListener('click', cleanCart);
};

window.onload = () => {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=';
  const product = 'computador';
  getProductList(url, product, setItensOnPage, console.log);
  getClickAddButton();
  createFieldTotalPrice();
  updateCartOnLoadPage();
  clickCleanCart();
};
