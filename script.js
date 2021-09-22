const cartItems = document.querySelector('.cart__items');
const buttonAddInCart = document.querySelector('section.items');
const getLoadingText = document.querySelector('.loading');

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

const requestProducts = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((data) => data.results.forEach(({ id, title, thumbnail }) => {
    const itemObject = {
      sku: id,
      name: title,
      image: thumbnail,
    };
    const itemElement = createProductItemElement(itemObject);
    const getClassItems = document.querySelector('.items');
    getClassItems.appendChild(itemElement);
    getLoadingText.remove();
  }));
}; // ref rerquisito 1 .: https://github.com/tryber/sd-015-b-project-shopping-cart/pull/33/commits/6974a393bc7f5f84e2300355ead2200545238289

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  return li;
}

function saveInLocalStorage() {
  const cartListToSave = JSON.stringify(cartItems.innerHTML);
  localStorage.setItem('cart', cartListToSave);
}

function cartItemClickListener(event) {
  event.target.remove();
  saveInLocalStorage();
}
async function addItemInTheCart(event) {
  const itemID = event.target.parentNode.firstChild.innerText;
    console.log(event);
    const itemUrl = `https://api.mercadolibre.com/items/${itemID}`;
    const getCart = document.querySelector('.cart__items');
    return fetch(itemUrl)
    .then((response) => response.json())
    .then((data) => {
      const cartItem = createCartItemElement(data);
      cartItems.appendChild(cartItem);
    })
    .then(() => saveInLocalStorage());
  }
  
  function loadLocalStorage() {
  const savedCart = JSON.parse(localStorage.getItem('cart'));
  cartItems.innerHTML = savedCart;
  cartItems.addEventListener('click', cartItemClickListener);
  }
  function addToCart() {
    buttonAddInCart.addEventListener('click', (event) => {
      if (event.target.classList.contains('item__add')) {
        return addItemInTheCart(event);
      }
    });
}

async function sumPrices() {
  const totalPrice = document.querySelector('.total-price');
  const getCartItems = document.querySelector('.cart__item');
  console.log(getCartItems.innerHTML);

  totalPrice.innerHTML = `Preço total: $${totalPrice}`;
}

function eraseCart() {
  const emptyCart = document.querySelector('.empty-cart');
  
  emptyCart.addEventListener('click', (event) => {
    cartItems.innerHTML = '';
    saveInLocalStorage();
  });
}

window.onload = () => {  
  requestProducts();
  addToCart();
  loadLocalStorage();
  sumPrices();
  eraseCart();
};