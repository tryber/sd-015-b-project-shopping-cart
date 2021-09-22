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
  const listOfProducts = document.querySelector('.cart__items');
  fetch(`https://api.mercadolibre.com/items/${getItemOfProduct}`)
  .then((response) => response.json())
  .then((item) => listOfProducts.appendChild(createCartItemElement(
    { sku: item.id, name: item.title, salePrice: item.price },
    )));
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

function computerListWithFech() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
  .then((response) => response.json())
  .then((listOfComputers) => createdObjetctToProducts(listOfComputers.results));
}

function removeProductShoppingCar() {
  const clickRemoveProduct = document.querySelectorAll('cart__items');
  clickRemoveProduct.forEach((click) => click.addEventListener('click', cartItemClickListener));
}

window.onload = () => {
  computerListWithFech();
 };
