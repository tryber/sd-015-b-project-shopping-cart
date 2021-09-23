function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// Requisito 3
function cartItemClickListener(event) {
  const clickRemove = event.target;
  clickRemove.remove();
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
      const olOfCartShoppping = document.querySelector('.cart__items');
      const productGoingToCart = createCartItemElement(product);
      olOfCartShoppping.appendChild(productGoingToCart);
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
  const cartItens = item.parentElement;
  
  return cartItens.querySelector('li.cart__item').remove();
}
const buttonRemoveCart = () => {
const emptyCart = document.querySelector('.empty-cart');
emptyCart.addEventListener('click', (event) => {
const olCart = document.querySelector('.cart__items');
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
