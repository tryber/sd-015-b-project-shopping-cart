const myClassNames = ['.cart__items', '.loading', '.cart', '.total-price', '.items',
  '.empty-cart', 'item__sku', 'item__title', 'item__add'];
const myTags = ['p', 'div', 'span', 'li', 'img', 'section', 'button'];

const createProductImageElement = (imageSource) => {
  const img = document.createElement(myTags[4]);
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const createCustomElement = (element, className, innerText) => {
  const elem = document.createElement(element);
  elem.className = className;
  elem.innerText = innerText;
  return elem;
};

const createProductItemElement = ({ sku, name, image }) => {
  const section = document.createElement(myTags[5]);
  section.className = 'item';
  section.appendChild(createCustomElement(myTags[2], myClassNames[6], sku));
  section.appendChild(createCustomElement(myTags[2], myClassNames[7], name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement(myTags[6], myClassNames[8], 'Adicionar ao carrinho!'));
  return section;
};

const getSkuFromProductItem = (item) =>
  item.querySelector(`${myTags[2]}.${myClassNames[6]}`).innerText;

const createLoading = () => {
  const cartItems = document.querySelector(myClassNames[0]);
  const loading = document.createElement(myTags[0]);
  loading.className = 'loading';
  loading.innerText = 'Loading...';
  cartItems.appendChild(loading);
};

const removeLoading = () => {
  const cartItems = document.querySelector(myClassNames[0]);
  const loading = document.querySelector(myClassNames[1]);
  cartItems.removeChild(loading);
};

const getFetch = (url, onSucess, onFail) => {
  const myFetch = fetch(url)
    .then((response) => response.json())
    .then((response) => {
      removeLoading();  
      onSucess(response);
    })
    .catch((error) => onFail(error));
  return myFetch;
};

const getProductList = async (url, product, onSucess, onFail) => {
  try {
    createLoading();
    const urlSearch = `${url}${product}`;
    return await getFetch(urlSearch, onSucess, onFail);
  } catch (error) {
    console.log(`Erro encontrado no bloco getProductList(): ${error}`);
  }
};

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
  const parent = document.querySelector(myClassNames[2]);
  const divTotalPrice = document.createElement(myTags[1]);
  divTotalPrice.className = 'div-total-price';
  const LabelTotalPrice = document.createElement(myTags[2]);
  LabelTotalPrice.innerText = 'Preço total: $';
  const fieldTotalPrice = document.createElement(myTags[2]);
  fieldTotalPrice.className = 'total-price';
  fieldTotalPrice.innerText = '0';
  parent.appendChild(divTotalPrice);
  divTotalPrice.appendChild(LabelTotalPrice);
  divTotalPrice.appendChild(fieldTotalPrice);
};

const updateTotalPrice = () => {
  const totalPrice = document.querySelector(myClassNames[3]);
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
  const arrayItems = [];
  response.results.forEach((res) =>
    arrayItems.push(formatItemListProducts(res.id, res.title, res.thumbnail)));
  const itemResponse = document.querySelector(myClassNames[4]);
  arrayItems.forEach((element) => appendProductItem(itemResponse, element));
};

const cartItemClickListener = (event) => {
  const parent = event.target.parentElement;
  parent.removeChild(event.target);
  removeItemLocalStorage(event.target.innerText.split('|')[0].split(':')[1].trim());
  updateTotalPrice();
};

const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement(myTags[3]);
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const formatItemListCart = (sku, name, salePrice) =>
  ({ sku, name, salePrice });

const setItensOnCart = (response) => {
  const cartItems = document.querySelector(myClassNames[0]);
  cartItems.appendChild(createCartItemElement(formatItemListCart(response.id,
    response.title, response.price)));
  setLocalStorage(response.id, response.title, response.price);
  updateTotalPrice();
};

const updateCartOnLoadPage = () => {
  const myStorage = verifyLocalStorage();
  const cartItems = document.querySelector(myClassNames[0]);
  myStorage.forEach((storage) => {
  cartItems.appendChild(createCartItemElement(formatItemListCart(storage.sku,
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
  const items = document.querySelector(myClassNames[4]);
  items.addEventListener('click', getProductSelected);
};

const cleanCart = () => {
  const cartItems = document.querySelector(myClassNames[0]);
  cartItems.innerHTML = '';
  localStorage.removeItem('ShoppingCartProject');
  updateCartOnLoadPage();
};

const clickCleanCart = () => {
  const emptyCart = document.querySelector(myClassNames[5]);
  emptyCart.addEventListener('click', cleanCart);
};

window.onload = () => {
  getProductList('https://api.mercadolibre.com/sites/MLB/search?q=',
    'computador', setItensOnPage, console.log);
  getClickAddButton();
  createFieldTotalPrice();
  updateCartOnLoadPage();
  clickCleanCart();
};
