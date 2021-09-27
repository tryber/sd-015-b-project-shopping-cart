const totalPriceClass = '.total-price';

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// REQUISITO 5
let sum = 0;

const subtractionTotalPrice = (product) => {
  const priceTotal = document.querySelector(totalPriceClass);
  const price = Number(product.innerHTML.split('$')[1]);
  sum -= price;
  const fixedTwo = sum.toFixed(2);
  const sumNumber = Number(fixedTwo);
  priceTotal.innerHTML = sumNumber;
};

  const sumTotalPrice = (price) => {
  const priceTotal = document.querySelector(totalPriceClass);
 sum += price;
 const fixedTwo = sum.toFixed(2);
 const sumNumber = Number(fixedTwo);
 priceTotal.innerHTML = sumNumber;
 };

// Requisito 3
function cartItemClickListener(event) {
  const clickRemove = event.target;
  clickRemove.remove();
  subtractionTotalPrice(clickRemove);
}

// Requisito 2
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

  function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const getListProductId = (elementItem) => {
  const id = getSkuFromProductItem(elementItem.parentElement);
  const API_URL = `https://api.mercadolibre.com/items/${id}`;
  fetch(API_URL)
    .then((response) => response.json())
    .then((product) => {
      console.log(product);
      const olOfCartShoppping = document.querySelector('.cart__items');
      const productGoingToCart = createCartItemElement(product);
      olOfCartShoppping.appendChild(productGoingToCart);
      sumTotalPrice(product.price);
    });
};

const getButtonFromAddItemToCart = () => {
  const allProducts = document.querySelector('.items');
  allProducts.addEventListener('click', (event) => {
    const buttonAdd = event.target;
    if (buttonAdd.className === 'item__add') {
      getListProductId(buttonAdd);
    }
   });
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
 
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}
// REquisito 7
const addLoading = () => {
const container = document.querySelector('.container');
const section = document.querySelector('.items');
const h2 = document.createElement('h2');
h2.className = 'loading';
h2.innerText = 'Loading';

return container.insertBefore(h2, section);
};

// REQUISITO 1 UM
const getListProducts = (product = 'computador') => {
  const API_URL = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
 
  fetch(API_URL)
    .then((response) => response.json())
    .then((listProd) => {
      const loading = document.querySelector('.loading');
      loading.remove();
      listProd.results.forEach((result) => {
      const section = document.querySelector('.items'); 
      section.appendChild(createProductItemElement(result));
    });
  });
};

// Requisito 6

function removeSkuFromCartShopping(item) {
 const cartItens = item.parentElement.querySelector('ol.cart__items');
 cartItens.innerHTML = '';
 const totalPrice = document.querySelector(totalPriceClass);
 totalPrice.innerHTML = '0.00';
 sum = 0;
}
 
const buttonRemoveCart = () => {
const emptyCart = document.querySelector('.empty-cart');
emptyCart.addEventListener('click', (event) => {
const buttonRemove = event.target;
removeSkuFromCartShopping(buttonRemove);
});
};

window.onload = () => { 
 addLoading();
 getListProducts();
 getButtonFromAddItemToCart();
 buttonRemoveCart();
};
