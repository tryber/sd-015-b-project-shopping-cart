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
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function generateList() {
   const listData = fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((list) => list.results.forEach(({ id, title, thumbnail }) => {
      const computerObject = {
        sku: id,
        name: title,
        image: thumbnail,
      };
      const getItemSection = document.querySelector('.items');
      const item = createProductItemElement(computerObject);
      getItemSection.append(item);
    }));
    return listData;
}

function increaseCart(item) {
  const itemId = getSkuFromProductItem(item);
  fetch(`https://api.mercadolibre.com/items/${itemId}`)
  .then((response) => response.json())
  .then(({ id, title, price }) => {
    const itemObject = {
      sku: id,
      name: title,
      salePrice: price, 
    };
    const addItem = document.querySelector('.cart__items');
  addItem.append(createCartItemElement(itemObject));
  });
  }

function prepareButtons() {
  const allItems = document.querySelectorAll('.item');
  allItems.forEach((item) => {
    const button = item.querySelector('.item__add');
    button.addEventListener('click', () => increaseCart(item));
  });
}

function load() {
  generateList()
  .then(() => {
    prepareButtons();
  });
}
window.onload = () => { 
  load();
};
