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

const requestProduct = () => fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((data) => data.results)
  .then((array) => {
    array.forEach((product) => {
      const section = document.querySelector('.items');
      section.appendChild((createProductItemElement({
        sku: product.id,
        name: product.title,
        image: product.thumbnail,
      })));
    });
  });

  function getSkuFromProductItem(item) {
    return item.querySelector('span.item__sku').innerText;
  }

  let totalPrice = 0;

function finalPrice(price) {
  totalPrice += price;
  const span = document.querySelector('.total-price');
  span.innerHTML = parseFloat(totalPrice.toFixed(2));
  return span;
}

  function saveItem() {
    const ol = document.querySelector('.cart__items');
    JSON.stringify(localStorage.setItem('list', ol.innerHTML));
  }

  async function cartItemClickListener(event) {
    const item = event.target;
    if (totalPrice > 0) {
      totalPrice -= event.target.id;
      const span = document.querySelector('.total-price');
      span.innerHTML = parseFloat(totalPrice.toFixed(2));
    }
  item.remove();
  saveItem();
}
  
  function createCartItemElement({ sku, name, salePrice }) {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
    li.id = salePrice;
    li.addEventListener('click', cartItemClickListener);
    li.addEventListener('click', finalPrice(salePrice));
    const ol = document.querySelector('.cart__items');
    return ol.appendChild(li) && saveItem();
  }

function itemClickListener() {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => button.addEventListener('click', () => {
    const sku = button.parentNode.firstChild;
    fetch(`https://api.mercadolibre.com/items/${sku.innerText}`)
      .then((response) => response.json())
      .then((product) => createCartItemElement({
          sku: product.id,
          name: product.title,
          salePrice: product.price,
        }));
  }));
}

function getItemLocalStorage() {
  const list = localStorage.getItem('list');
  if (list) {
    const ol = document.querySelector('#cart__items');
    ol.innerHTML = list;
    ol.childNodes.forEach((li) => {
      li.addEventListener('click', cartItemClickListener);
    });
  }
} 

window.onload = () => {  
  requestProduct()
    .then(() => itemClickListener());
  getItemLocalStorage();
};