let price = 0;
const storageItem = ((id, li) => window.localStorage.setItem(id, li.innerText));

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

async function getProductList() {
  const fetchUrl = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$"computador"')
    .then((response) => response.json());
  const result = await fetchUrl.results;
  return result;
}

async function cartTotalPrice(productPrice, operation) {
  const totalprice = document.querySelector('.total-price');
  if (operation === '-') {
    price = parseFloat(totalprice.innerText) - parseFloat(productPrice);
  }
  if (operation === '+') {
    price = parseFloat(totalprice.innerText) + parseFloat(productPrice);
  }
  totalprice.innerText = price;
}

function getSkuFromProductItem(item) {
  const itemElement = item.parentElement;
  return itemElement.firstElementChild.innerText;
}

function eraseCartButton() {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    const cartList = document.querySelectorAll('.cart__item'); 
    cartList.forEach((item) => {
      item.remove();
      window.localStorage.clear();
      document.querySelector('.total-price').innerText = 0;
    });
  });
}

function cartItemRemove(event) {
  // coloque seu código aqui
  const itemClicked = event.target;
  const text = itemClicked.innerText;
  const itemSplit = text.split('|');
  const salePrice = itemSplit[2].slice(9);
  cartTotalPrice(salePrice, '-');
  window.localStorage.removeItem(text);
  itemClicked.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemRemove);
  storageItem(sku, li);
  return li;
}

async function cartItems(event) {
const productId = getSkuFromProductItem(event.target);
const fetchItem = await fetch(`https://api.mercadolibre.com/items/${productId}`);
const product = await fetchItem.json();

const cartList = document.querySelector('.cart__items');
cartList.appendChild(createCartItemElement(
  { sku: product.id, name: product.title, salePrice: product.price },
));
cartTotalPrice(product.price, '+');
}

async function itemsListEventAdd() {
  const itemAdd = document.querySelectorAll('.item__add');
  itemAdd.forEach((button) => button.addEventListener('click', cartItems));
}

async function createProducts() {
  const productList = await getProductList();
  const sectionItems = document.querySelector('section.items');

  productList.forEach((product) => {
    const { id, title, thumbnail } = product;
    const products = createProductItemElement({ sku: id, name: title, image: thumbnail });
    sectionItems.appendChild(products);
  });
  itemsListEventAdd();
}

function loadCartItems() {
  const items = document.querySelectorAll('.cart__item');
}

window.onload = async () => {
  cartTotalPrice();
  createProducts();
  loadCartItems();
  eraseCartButton();
 };
