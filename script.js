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

function totalPrice() {
  const total = document.querySelector('.total-price');
  const listItems = document.querySelectorAll('.cart__item');
  let price = 0;
  listItems.forEach((element) => {
    const text = element.innerText;
    const p = Number(text.split('$')[1]);
    price += p;
  });
  total.innerText = price;
}

function clearCart() {
  document.querySelectorAll('.cart__item').forEach((element) => element.remove());
  totalPrice();
}

function emptyCartButton() {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', clearCart);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
  totalPrice();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addItem(sku) {
  const response = await fetch(`https://api.mercadolibre.com/items/${sku}`);
  const data = await response.json();
  const name = data.title;
  const salePrice = data.price;
  const cart = createCartItemElement({ id: sku, title: name, price: salePrice });
  document.querySelector('.cart__items').appendChild(cart);
  totalPrice();
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', () => addItem(sku));
  section.appendChild(button);
  
  return section;
}

const fetchPC = async () => {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  const data = await response.json();
  return data;
};

const getPC = ({ results }) => {
  results.forEach((result) => {
    document.querySelector('.items')
    .appendChild(createProductItemElement(result));
  });
};

const loadingRemove = () => document.querySelector('.loading').remove();

const getData = async () => {
  try {
    getPC(await fetchPC());
    emptyCartButton();
    loadingRemove();
  } catch (error) {
    console.log('Deu errado :(');
  }
};

window.onload = () => {
  getData();
 };
