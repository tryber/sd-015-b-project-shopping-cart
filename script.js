const listOfProducts = document.querySelector('.cart__items');

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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const buttonTest = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  buttonTest.id = sku;
  section.appendChild(buttonTest);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const classProducts = event.target;
  classProducts.remove();

  const removeFromLocalStorage = (classProducts.innerText.substring(5, 18));
  localStorage.removeItem(removeFromLocalStorage);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

/* Criação de novas funções a partir desta linha */
function APIToSelectItem(event) {
  const getItemOfProduct = getSkuFromProductItem(event.target.parentElement);
  fetch(`https://api.mercadolibre.com/items/${getItemOfProduct}`)
  .then((response) => response.json())
  .then((item) => listOfProducts.appendChild(createCartItemElement(
        { sku: item.id, name: item.title, salePrice: item.price },
    )));

  localStorage.setItem(getItemOfProduct, getItemOfProduct);
}

function addProductShoppingCar() {
  const buttonAddProduct = document.querySelectorAll('.item__add');
  buttonAddProduct.forEach((buttons) => buttons.addEventListener('click', APIToSelectItem));
}

function createdObjetctToProducts(listOfComputers) {
  const findFatherOfList = document.querySelector('.items');
  for (let index = 0; index < listOfComputers.length; index += 1) {
    const createItems = createProductItemElement(listOfComputers[index]);
    findFatherOfList.appendChild(createItems);
  }
  addProductShoppingCar();
}

function removeMessageLoad() {
  const removeMessage = document.querySelector('.loading');
    removeMessage.remove();
}

function computerListWithFech() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
  .then((response) => response.json())
  .then((listOfComputers) => createdObjetctToProducts(listOfComputers.results))
  .then(() => removeMessageLoad());
}

function removeProductShoppingCar() {
  listOfProducts.forEach((click) => click.addEventListener('click', cartItemClickListener));
}

function reloadListOfProducts() {
  const keyss = Object.keys(localStorage);
  for (let index = 0; index < keyss.length; index += 1) {
    const listOfProduct = document.querySelector('.cart__items');
    fetch(`https://api.mercadolibre.com/items/${keyss[index]}`)
    .then((response) => response.json())
    .then((item) => listOfProduct.appendChild(createCartItemElement(
          { sku: item.id, name: item.title, salePrice: item.price },
      )));
  }
}

function emptyCartShopping() {
  listOfProducts.parentNode.removeChild(listOfProducts);
  localStorage.clear();
  document.location.reload(true);
}
const emptyButton = document.querySelector('.empty-cart');
emptyButton.addEventListener('click', emptyCartShopping);

function addMessageLoad() {
  createCustomElement('div', 'loading', 'loading...');
}

window.onload = () => {
  computerListWithFech();
  reloadListOfProducts();
  addMessageLoad();
};
