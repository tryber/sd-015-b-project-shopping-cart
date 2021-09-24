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

// Requisito 5
function totalCartPrice() {
  const cartItems = document.querySelectorAll('.cart__item');
  const totalPriceHtml = document.querySelector('.total-price');
  let totalPrice = 0;
  for (let index = 0; index < cartItems.length; index += 1) {
    const price = cartItems[index].getAttribute('price');
    totalPrice += parseFloat(price);  
  }
  totalPriceHtml.innerText = totalPrice;
}

// Requisito 3
function cartItemClickListener(event) {
  event.target.remove();
  totalCartPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.setAttribute('price', salePrice);
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
    const cartItems = document.querySelector('.cart__items');
    cartItems.appendChild(createdItem);
    totalCartPrice();
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

// Requisito 6
function clearCart() {
  const cartItems = document.querySelector('.cart__items');
  while (cartItems.firstChild) {
    cartItems.removeChild(cartItems.firstChild);
  }
  totalCartPrice();
}

window.onload = () => {
  createProductList();
  const clearCartButton = document.querySelector('.empty-cart'); // Requisito 6
  clearCartButton.addEventListener('click', clearCart); // Requisito 6
};
