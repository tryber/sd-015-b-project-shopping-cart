const cartItemClass = '.cart__items';
const ol = document.querySelector(cartItemClass);
function search(item) {
  const urlApi = `https://api.mercadolibre.com/sites/MLB/search?q=${item}`;
  return urlApi;
}

async function getApiFetch(item) {
  let listOfProducts = [];
  await fetch(search(item))
  .then((result) => result.json())
  .then((computers) => {
    listOfProducts = computers.results;
  });
  return listOfProducts;
}

function saveCartItem() {
  localStorage.setItem('cart', ol.innerHTML);
}

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

let sum = 0;
function priceItems({ price: salePrice }) {
  const total = document.querySelector('.total-price');
  sum += salePrice;
  total.innerText = sum;
}

function cartItemClickListener() {
  const cart = document.querySelector(cartItemClass);
  cart.addEventListener('click', (event) => {
    if (event.target.className === 'cart__item') {
      event.target.classList.add('select');
      const item = document.querySelector('.select');
      cart.removeChild(item);
      saveCartItem();
    }
  });
}

function emptyCart() {
  const button = document.querySelector('.empty-cart');
  const cart = document.querySelector(cartItemClass);
  button.addEventListener('click', () => {
    cart.innerHTML = '';
    saveCartItem();
  });
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  priceItems({ price: salePrice });
  return li;
}

async function getProductItem(item) {
  const array = await getApiFetch(item);
  array.forEach((element) => {
    const object = {
      sku: element.id,
      name: element.title,
      image: element.thumbnail,
    };
    const section = createProductItemElement(object);
    const newItem = document.querySelector('.items');
    newItem.appendChild(section);
  }); 
  const mensagem = document.querySelector('.loading');
  mensagem.parentNode.removeChild(mensagem);
}

function selectedItem() {
  const button = document.querySelector('.items');
  button.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      const id = getSkuFromProductItem(event.target.parentElement);
      fetch(`https://api.mercadolibre.com/items/${id}`)
      .then((result) => result.json())
      .then((result) => ol.appendChild(createCartItemElement(result)))      
      .then(() => saveCartItem());
    }
  });
}

window.onload = () => {
  getProductItem('computador');
  cartItemClickListener();
  selectedItem();
  emptyCart();
  ol.innerHTML = localStorage.getItem('cart');
};
