const APIMercadoLibre = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const APIItems = 'https://api.mercadolibre.com/items/';
const olCartItems = '.cart__items';
const spanTotalPrice = '.total-price';
let sum = 0;

// Requisito 4 - Carregue o carrinho de compras através do LocalStorage ao iniciar a página

const saveCart = () => {
  const cartItems = document.querySelector(olCartItems);
  localStorage.setItem('cartItems', cartItems.innerHTML);
};

const saveTotalPrice = () => { // Adição requisito 5
  const span = document.querySelector(spanTotalPrice);
  localStorage.setItem('totalPrice', span.innerHTML);
};

const getCart = () => {
  document.querySelector(olCartItems)
    .innerHTML = localStorage.getItem('cartItems');
  // Adição requisito 5
  document.querySelector('.total-price')
    .innerHTML = localStorage.getItem('totalPrice');
};

// Requisito 3 - Remova o item do carrinho de compras ao clicar nele

function cartItemClickListener(event) {
  const span = document.querySelector(spanTotalPrice);
  const price = parseFloat(event.target.innerHTML.split('$')[1], 10);
  event.target.remove();
  sum -= price;
  span.innerHTML = sum;
  saveTotalPrice();
  saveCart();
}

// Requisito 4 - Carregue o carrinho de compras através do LocalStorage ao iniciar a página
const cartAddEventListener = () => {
  const listCart = document.querySelectorAll('.cart__item');
  listCart.forEach((li) => {
    li.addEventListener('click', (event) => {
      cartItemClickListener(event);
    });
  });
};

// Requisito 5 - Some o valor total dos itens do carrinho de compras

const cartTotalPrice = (infoItem) => {
  const span = document.querySelector(spanTotalPrice);
  sum += infoItem.salePrice;
  span.innerHTML = sum;
};

// Requisito 2 - Adicione o produto ao carrinho de compras

const requestApiItems = async (itemID) => {
  const response = await fetch(`${APIItems}${itemID}`);
  return response.json();
};

/* 
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} 
*/

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addItemToCart = (itemID) => {
  requestApiItems(itemID)
  .then(({ id, title, price }) => {
      const infoItem = {
        sku: id,
        name: title,
        salePrice: price,
      };
      document.querySelector(olCartItems)
        .appendChild(createCartItemElement(infoItem));
      cartTotalPrice(infoItem); // Requisito 5
      saveCart(); // Requisito 4
      saveTotalPrice();
    });
};

// Requisito 1 - Crie uma listagem de produtos

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

  // Adição para tratar requisito 2
  const buttonEventListener = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(buttonEventListener);
  buttonEventListener.addEventListener('click', () => addItemToCart(sku));

  return section;
}

const productList = async () => {
  const response = await fetch(APIMercadoLibre);
  const responseJson = await response.json();
  const data = responseJson.results;

  data.forEach(({ id, title, thumbnail }) => {
    const item = {
      sku: id,
      name: title,
      image: thumbnail,
    };

    const sectionItems = document.querySelector('.items');
    sectionItems.appendChild(createProductItemElement(item));
  });
};

window.onload = async () => {
  await productList();
  const getTotalPrice = localStorage.getItem('totalPrice');
  if (getTotalPrice) {
    sum = parseFloat(getTotalPrice);
  }
  getCart();
  cartAddEventListener();
};
