const Query = 'computador';
const API_URL = `https://api.mercadolibre.com/sites/MLB/search?q=${Query}`;

const cartList = document.querySelector('.cart__items');

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

function cartItemClickListener() {
 this.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  return li;
}

const startButtonHandlers = () => {
  const arrayButtons = document.querySelectorAll('.item__add');
  arrayButtons.forEach((button) => button.addEventListener('click', () => {
    const sectionElement = button.closest('section');
    const idItem = getSkuFromProductItem(sectionElement);
    fetch(`https://api.mercadolibre.com/items/${idItem}`)
      .then((response) => response.json())
      .then((data) => createCartItemElement(
        { sku: data.id, name: data.title, salePrice: data.price },
      ))
      .then((cartItem) => cartList.appendChild(cartItem));
      // .then((listItem) => localStorage.setItem())
  }));
};

function clearCartItems() {
  const buttonCart = document.querySelector('.empty-cart');
  buttonCart.addEventListener('click', () => {
    const items = cartList;
    items.innerHTML = '';
  });
}

fetch(API_URL)
  .then((response) => response.json())
  .then((data) => data.results)
  .then((results) => results.forEach((computer) => {
    const items = document.querySelector('.items');
    items.appendChild(createProductItemElement(
      { sku: computer.id, name: computer.title, image: computer.thumbnail },
    ));
  }))
  .then(() => startButtonHandlers())
  .then(() => clearCartItems());

window.onload = () => {

};
