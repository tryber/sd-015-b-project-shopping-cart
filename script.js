const items = document.querySelector('.items');
const cartItems = document.querySelector('.cart__items');
const cart = document.querySelector('.cart');
const priceOfCart = [];
const emptyCartBtn = document.querySelector('.empty-cart');

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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function createPrice(totalPrice) {
  const price = document.querySelector('.total-price');
  const showPrice = document.querySelector('.total-price-text');
  if (price) {
    price.remove();
    showPrice.remove();
  }
  const priceText = createCustomElement('span', 'total-price-text', `Total: R$ ${totalPrice}`);
  const priceToCreate = createCustomElement('span', 'total-price', totalPrice);
  cart.appendChild(priceText);
  cart.appendChild(priceToCreate);
} 

function getTotalPrice() {
  let sum = 0;
  if (priceOfCart.length !== 0) {
    sum = priceOfCart.reduce((previousValue, currentValue) => previousValue + currentValue);
  }
  return parseFloat(sum);
}

function getCartElementIndex(itemName) {
  const cartItemsArray = document.querySelectorAll('.cart__item');
  cartItemsArray.forEach((item, index) => {
    if (priceOfCart.length === cartItemsArray.length && item.innerText === itemName) {
        priceOfCart.splice(index, 1);
    }
  });
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const clickedElement = event.target;
  getCartElementIndex(clickedElement.innerText);
  createPrice(getTotalPrice());
  clickedElement.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function getProducts() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  const computers = await response.json();
  const { results } = computers;
  return results;
}

async function createProducts() {
  const products = await getProducts();
    await products.forEach((product) => {
      items.appendChild(createProductItemElement(product));
    });
}

items.addEventListener('click', (ev) => {
  const btnClicked = ev.target;
  if (btnClicked.classList.contains('item__add')) {
    const productID = btnClicked.parentNode.firstElementChild.innerText;
    fetch(`https://api.mercadolibre.com/items/${productID}`)
      .then((response) => response.json())
      .then((product) => {
        cartItems.appendChild(createCartItemElement(product));
        priceOfCart.push(product.price);
        createPrice(getTotalPrice());
      });
  }
});

emptyCartBtn.addEventListener('click', () => {
  const cartItemsArray = document.querySelectorAll('.cart__item');
  cartItemsArray.forEach((item) => item.remove());
  createPrice(0);
});

window.onload = () => { 
  createProducts();
  createPrice(0);
};