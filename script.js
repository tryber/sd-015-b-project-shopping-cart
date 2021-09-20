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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Requisito 3
function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Requisito 2
function addToCart() {
  const productId = getSkuFromProductItem(this);
  fetch(`https://api.mercadolibre.com/items/${productId}`)
  .then((response) => response.json())
  .then(({ id, title, price }) => {
    const item = {
      sku: id,
      name: title,
      salePrice: price,
    };
    const createdItem = createCartItemElement(item);
    const cartList = document.querySelector('.cart__items');
    cartList.appendChild(createdItem);
  });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.addEventListener('click', addToCart);

  return section;
}

// Requisito 1
async function createProductList() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const resultObject = await response.json();
  return resultObject.results.forEach(({ id, title, thumbnail }) => {
    const itensOutput = {
      sku: id,
      name: title,
      image: thumbnail,
    };
    const selectItems = document.querySelector('.items');
    const itemCreate = createProductItemElement(itensOutput);
    selectItems.append(itemCreate);
  });
}

window.onload = () => { 
  createProductList();
};
