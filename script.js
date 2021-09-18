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

function cartItemClickListener(event) {

}

function createCartItemElement({ sku, name, salePrice }) {
  console.log(sku, name, salePrice);
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
//  function test() {
//   const arrayButtons = document.getElementsByClassName('item__add');
//   arrayButtons.forEach((button) => button.addEventListener('click', () => {
//     const skuElement = button.closest('span.item__sku');
//     const idItem = skuElement;
//     fetch(`https://api.mercadolibre.com/items/${idItem}`)
//     .then((data) => createCartItemElement(
//       { sku: data.id, name: data.title, salePrice: data.price },
//       ));
//   }));
// }

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
  }));
};

fetch(API_URL)
  .then((response) => response.json())
  .then((data) => data.results)
  .then((results) => results.forEach((computer) => {
    console.log('obtive resultado');
    const items = document.querySelector('.items');
    items.appendChild(createProductItemElement(
      { sku: computer.id, name: computer.title, image: computer.thumbnail },
    ));
  }))
  .then(() => startButtonHandlers());
console.log('vou criar o botão');

window.onload = () => {

};
