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

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

function getProductId(element) {
  const sectionItem = element.parentElement;
  return sectionItem.firstElementChild.innerText;
}

function getProductByIdFromEndpoint(event) {
  const button = event.target;
  const itemId = getProductId(button);

  fetch(`https://api.mercadolibre.com/items/${itemId}`)
    .then((response) => response.json())
    .then((result) => {
      const cartItem = document.querySelector('.cart__items');
      cartItem.appendChild(createCartItemElement(
        { sku: result.id, name: result.title, salePrice: result.price },
      ));
    });
}

async function handleItemsListButtonEventAdd() {
  const itemsListButtons = document.querySelectorAll('.item__add');
  itemsListButtons.forEach((button) => {
    button.addEventListener('click', getProductByIdFromEndpoint);
  });
}

async function getProductsFromEndpoint() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((info) => info.results)
    .then((results) => results.forEach((itemOnSale) => {
      const item = document.querySelector('.items');
      item.appendChild(createProductItemElement(
        { sku: itemOnSale.id, name: itemOnSale.title, image: itemOnSale.thumbnail },
      ));
    }))
    .then(() => handleItemsListButtonEventAdd());
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function handleAll() {
  getProductsFromEndpoint();
}

window.onload = () => { 
  handleAll();
};
