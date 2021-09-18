const site = 'https://api.mercadolibre.com';
const storage = localStorage.getItem('cardList');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function saveCart() {
  const cartItems = [...document.querySelectorAll('.cart__item')];
  const itemForLocalStorage = [];

  cartItems.forEach((item) => {
    itemForLocalStorage.push(item.innerHTML);
  });

  localStorage.setItem('cardList', JSON.stringify(itemForLocalStorage));
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

const getTotalPrice = (price, operation) => {
  const totalPrice = document.querySelector('.total-price');
  let total = 0;
  if (totalPrice.innerText) {
    total = parseFloat(totalPrice.innerText);
  }
  if (operation === 'sum') {
    total += price;
  }
  if (operation === 'sub') {
    total -= price;
  }
  totalPrice.innerText = total > 0 ? total.toFixed(2) : '0';
  localStorage.setItem('total', total);
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  document.querySelector('.items').appendChild(section);
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  event.target.remove(event);
  saveCart();
  const li = event.path[0];
  getTotalPrice((li.innerText.split('PRICE: $').pop()), 'sub');
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  saveCart();
  return li;
}

function retrieveSavedCart() {
  const listItems = document.querySelector('.cart__items');
  const previousCart = JSON.parse(localStorage.getItem('cardList'));

  previousCart.forEach((item) => {
    const li = document.createElement('li');
    li.innerHTML = item;
    li.classList.add('cart__item');
    li.addEventListener('click', cartItemClickListener);
    listItems.append(li);
  });
}

function receiveDataItem(item) {
  const itemData = createCartItemElement({
    sku: item.id,
    name: item.title,
    salePrice: item.price,
  });
  getTotalPrice(item.price, 'sum');
  document.querySelector('.cart__items').appendChild(itemData);
}

const addCart = (event) => {
  const itemId = event.target.parentNode.firstChild.innerText;

  fetch(`${site}/items/${itemId}`)
    .then((response) => response.json())
    .then((dataItem) => receiveDataItem(dataItem));
};

const fetchProduct = () => fetch(`${site}/sites/MLB/search?q=computador`)
  .then((answer) => answer.json());

const addSectionProduct = (product) => {
  const productData = createProductItemElement({
    sku: product.id,
    name: product.title,
    image: product.thumbnail,
  });
  document.querySelector('.items').appendChild(productData);

  const btnsAddToCard = document.querySelectorAll('.item__add');
  btnsAddToCard.forEach((btn) => btn.addEventListener('click', addCart));
};

window.onload = () => {
  fetchProduct()
    .then((productData) => {
      productData.results.forEach((result) => {
        addSectionProduct(result);
      });
    });
  if (storage) retrieveSavedCart();
};
