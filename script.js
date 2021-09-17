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
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addToCart(event) {
  try {
    const product = event.target.parentNode.firstChild;
    const url = `https://api.mercadolibre.com/items/${product.id}`;
    const myFetch = await fetch(url);
    const searchResult = await myFetch.json();
    const results = { 
      sku: searchResult.id, 
      name: searchResult.title, 
      salePrice: searchResult.price,
    };
    const returnedElement = createCartItemElement(results);
    const carItems = document.querySelector('.cart__items');
    carItems.appendChild(returnedElement);
  } catch (error) {
    console.log(error);
  }
}

function loadAddButton() {
  const addButton = document.querySelectorAll('.item__add');
  addButton.forEach((button) => button.addEventListener('click', addToCart));
}

async function createProductsList() {
  try {
    const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
    const myFetch = await fetch(url);
    const searchResult = await myFetch.json();
    const products = await searchResult.results;
    products.forEach(({ id, title, thumbnail }) => {
      const changeName = { sku: id, name: title, image: thumbnail };
      const x = createProductItemElement(changeName);

      const section = document.querySelector('.items');
      section.appendChild(x);
    });
    loadAddButton();
  } catch (error) {
    console.log(error);
  }
}

window.onload = () => {
  createProductsList();
  addToCart('MLB1607748387');
};
