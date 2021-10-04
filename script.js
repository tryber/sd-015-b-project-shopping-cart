const shoppingCart = document.querySelector('.cart__items');

function saveLocalStorage() {
  localStorage.setItem('cart_list', shoppingCart.innerHTML);
}

function cartItemClickListener(event) {
  event.target.remove();
  saveLocalStorage();
}

function loadLocalStorage() {
  shoppingCart.innerHTML = localStorage.getItem('cart_list');
  shoppingCart.childNodes.forEach((list) => {
    list.addEventListener('click', cartItemClickListener);
  });
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
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

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addCartProduct(event) {
  try {
    const itemID = getSkuFromProductItem(event.target.parentNode);
    const response = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
    const cartProduct = await response.json();
    const { id, title, price } = cartProduct;
    const itemSearch = { sku: id, name: title, salePrice: price };
    const itemElement = createCartItemElement(itemSearch);
    const section = document.querySelector('.cart__items');
    section.appendChild(itemElement);
    saveLocalStorage();
  } catch (error) {
    console.log('Erro no async cart');
  }
}

function buttonCartProduct() {
  const btt = document.querySelectorAll('.item__add');
  btt.forEach((button) => button.addEventListener('click', (event) => {
    addCartProduct(event);
  }));
}

async function createProductList() {
  try {
    const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
    const productList = await response.json();
    document.querySelector('.loading').remove();
    productList.results.forEach(({ id, title, thumbnail }) => {
      const itemSearch = { sku: id, name: title, image: thumbnail };
      const itemElement = createProductItemElement(itemSearch);
      const section = document.querySelector('.items');
      section.appendChild(itemElement);
    });
    buttonCartProduct();
  } catch (error) {
    console.log('Erro no async list');
  }
}

// function sumProductPrices() {
//   const price = document.querySelector('.cart__item');
//   console.log(price);
// }

window.onload = () => {
  createProductList();
  loadLocalStorage();
};
