const classOfCartItems = '.cart__item';

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

function saveStorage() {
  const itensOnCart = document.querySelectorAll(classOfCartItems);
  const itemStorage = [];
  itensOnCart.forEach((cartItem) => itemStorage.push(cartItem.innerHTML));
  localStorage.setItem('savedCartItem', JSON.stringify(itemStorage));
}

async function getCartTotalPrice() {
  const shoppingCartItems = document.querySelectorAll(classOfCartItems);
  const cartItemsPrices = [...shoppingCartItems].map((item) => {
    const priceString = item.innerText.split('$').reverse()[0];
    console.log(priceString);
    const priceNumber = parseFloat(priceString, 10);
    console.log(priceNumber);
    return priceNumber;
  });
  console.log(cartItemsPrices);
  const sumOfPrices = cartItemsPrices.reduce((result, current) => (result + current), 0);
  document.querySelector('.total-price').innerHTML = `${sumOfPrices}`;
}

function cartItemClickListener(event) {
  const cartItem = event.target;
  cartItem.remove();
  getCartTotalPrice();
  saveStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  return li;
}
const addToCart = async (item) => {
  const itemID = getSkuFromProductItem(item);
  fetch(`https://api.mercadolibre.com/items/${itemID}`)
  .then((response) => response.json())
  .then(({ id, title, price }) => {
    const productObject = {
      sku: id,
      name: title,
      salePrice: price,
    };
    const ol = createCartItemElement(productObject);
    const cartItems = document.querySelector('.cart__items');
    cartItems.appendChild(ol);
    getCartTotalPrice();
    saveStorage();
  });
};

function addListenersToButtons() {
  const listOfItems = document.querySelectorAll('.item');
  listOfItems.forEach((item) => item.lastChild.addEventListener('click', (() => addToCart(item))));
}

function loadStorage() {
  const savedItems = JSON.parse(localStorage.getItem('savedCartItem'));
  localStorage.clear();
  savedItems.forEach((itemSaved) => {
    const li = document.createElement('li');
    li.classList.add('cart__item');
    li.innerText = itemSaved;
    li.addEventListener('click', cartItemClickListener);
    document.querySelector('.cart__items').appendChild(li);
  });
  getCartTotalPrice();
}

async function requestProducts() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const data = await response.json();
  const sectionItens = document.querySelector('.items');
  const result = data.results.forEach(({ id, title, thumbnail }) => {
    const itemObject = { 
      sku: id,
      name: title,
      image: thumbnail,
    };
    const itemElement = createProductItemElement(itemObject);
    sectionItens.append(itemElement);
  });
  sectionItens.removeChild(sectionItens.firstChild);
  addListenersToButtons();
  loadStorage();
  return result;
}

function emptyCart() {
  const itemsToBeErased = document.querySelectorAll(classOfCartItems);
  itemsToBeErased.forEach((element) => element.remove());
  document.querySelector('.total-price').innerHTML = 0;
}

function loading() {
  const loadingText = document.createElement('p');
  loadingText.innerText = 'loading...';
  loadingText.classList.add('loading');
  document.querySelector('.items').appendChild(loadingText);
}

window.onload = () => { 
  loading();
  requestProducts();
  const emptyCartButton = document.querySelector('.empty-cart');
  emptyCartButton.addEventListener('click', emptyCart);
};
