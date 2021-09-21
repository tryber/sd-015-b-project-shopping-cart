function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}
const empytCartItem = document.querySelector('.cart__item');
function cartItemClickListener(event) {
  // coloque seu código aqui
  const listItem = event.target;
  listItem.remove();
}
// empytCartItem.addEventListener('click', () => cartItemClickListener());
/*   const olFather = document.querySelector('.cart__items');
  while (olFather.firstChild) {
    olFather.removeChild(olFather.firstChild);
  } */

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}
function selected(sku) {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then((responsive) => responsive.json())
    .then((dados) => createCartItemElement(dados))
    .then((newItem) => {
      const list = document.querySelector('.cart__items');
      list.appendChild(newItem);
    }); // capturing objects
}
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const buttonSelect = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  buttonSelect.addEventListener('click', () => selected(sku));
  section.appendChild(buttonSelect); // creating buton 

  return section;
}

function creatObject(dados) {
  const divHtml = document.querySelector('.items'); // capturing div by class items
  dados.forEach((element) => {
    const item = createProductItemElement(element);
    divHtml.appendChild(item);
  });
}

function requestComputer() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then((responsive) => responsive.json())
    .then((dados) => creatObject(dados.results)); // capturing objects
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

window.onload = () => {
  requestComputer();
  // requestItemId();
};
