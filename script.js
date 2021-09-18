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
  const cartItem = event.target;
  cartItem.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
const addToCart = async (item) => {
  const itemID = getSkuFromProductItem(item);
  fetch(`https://api.mercadolibre.com/items/${itemID}`)
  .then((response) => response.json())
  .then(({ id, title, price }) => {
    const productObject = {
      sku: id,
      name: title,
      salePrice: price,
    };
    const ol = createCartItemElement(productObject);
    const cartItems = document.querySelector('.cart__items');
    cartItems.appendChild(ol);
  });
};

function addListenersToButtons() {
  const listOfItems = document.querySelectorAll('.item');
  listOfItems.forEach((item) => item.lastChild.addEventListener('click', (() => addToCart(item))));
}
async function requestProducts() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const data = await response.json();
  const result = data.results.forEach(({ id, title, thumbnail }) => {
    const itemObject = { 
      sku: id,
      name: title,
      image: thumbnail,
    };
    const itemElement = createProductItemElement(itemObject);
    const sectionItens = document.querySelector('.items');
    sectionItens.append(itemElement);
  });
  addListenersToButtons();
  return result;
}

window.onload = () => { 
  requestProducts();
};
