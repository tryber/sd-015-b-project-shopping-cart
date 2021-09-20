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

let cartTotal = 0;

function cartSum() {
  const sumDisplay = document.querySelector('.total-price');
  sumDisplay.innerText = `${cartTotal}`;
}

function cartItemClickListener(event) {
  if (event) {
    (this).remove();
    cartTotal -= this.id;
    cartSum();
}
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.id = `${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createCartTotal() {
  const section = document.querySelector('.cart');
  section.appendChild(createCustomElement('p', 'total-price', `Preço total: $ ${cartTotal}`));
}

const test = document.querySelector('.loading');
console.log(test);
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
    createCartTotal();
    return listData;
}

function increaseCart(item) {
  const itemId = getSkuFromProductItem(item);
  fetch(`https://api.mercadolibre.com/items/${itemId}`)
  .then((response) => response.json()
  .then(({ id, title, price }) => {
    const itemObject = {
      sku: id,
      name: title,
      salePrice: price, 
    };
    const addItem = document.querySelector('.cart__items');
  addItem.append(createCartItemElement(itemObject));
  cartTotal += itemObject.salePrice;
  cartSum();
  }));
} 
  
  function clearCart() {
    const fullCart = document.querySelectorAll('.cart__item');
    fullCart.forEach((element) => {
      (element).remove();
    });
    cartTotal = 0;
    cartSum();
  }

function prepareButtons() {
  const allItems = document.querySelectorAll('.item');
  const removeItems = document.querySelector('.empty-cart');
  const loading = document.querySelector('.loading');
  allItems.forEach((item) => {
    const button = item.querySelector('.item__add');
    button.addEventListener('click', () => increaseCart(item));
  });
  removeItems.addEventListener('click', clearCart);
  loading.remove();
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
