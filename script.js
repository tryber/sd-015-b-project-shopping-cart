const urlAPI = 'https://api.mercadolibre.com/sites/MLB/search?q=$computer';
const test = () => document.querySelector('.cart__items');

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

function sendCartToCloud() {
  const cartIems = document.querySelectorAll('.cart__items li');
  const infoItems = [];
  cartIems.forEach(({ innerText }) => {
    const divideByBar = innerText.split('|');
    const [notTreatedId] = divideByBar;
    const divideByColon = notTreatedId.split(':');
    const treatedId = divideByColon[1].trim();
    infoItems.push(treatedId);
  });
  const stringItems = JSON.stringify(infoItems);

  localStorage.setItem('cart-items-ids', stringItems);
}

function getTotalItemValue(items) {
  const tPrice = document.querySelector('.total-price');
  let price = 0;
  items.forEach((item) => {
    const itemID = item.innerText.split(' ')[1];
    fetch(`https://api.mercadolibre.com/items/${itemID}`)
     .then((itemObject) => itemObject.json())
     .then((itemPrice) => {
       console.log(itemPrice.price);
       price += itemPrice.price;
     })
     .then(() => {
       tPrice.innerText = price;
       console.log(`o total é ${price}`);
      });
  });  
}

function updatePrice(option) {
  const tPrice = document.querySelector('.total-price');
  const items = document.querySelectorAll('.cart__item');
  if (items.length === 0) {
    tPrice.innerText = 0;
  } else {
  getTotalItemValue(items);
  }
  sendCartToCloud();
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const li = event.target;
  li.parentElement.removeChild(li);
  sendCartToCloud();
  updatePrice('remove');
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addCart(sku) {
  const response = await fetch(`https://api.mercadolibre.com/items/${sku}`);
  const results = await response.json();
  const name = results.title;
  const salePrice = results.price;
  const cart = createCartItemElement({ sku, name, salePrice });
  const cartItems = test();
  cartItems.appendChild(cart);
  sendCartToCloud();
  updatePrice();
}

const getCartCointainer = () => document.querySelector('.cart__items');
const getApiData = async (api, product) => {
  const apiProduct = await fetch(api + product);
  const response = await apiProduct.json();

  return (response);
};
const filterInfoToSendToCart = async (textId) => {
  const itemDetails = await getApiData('https://api.mercadolibre.com/items/', textId);
  const { id, title, price } = itemDetails;
  return { sku: id, name: title, salePrice: price };
};
const loadCloudCart = () => {
  const stringCloudCart = localStorage.getItem('cart-items-ids');
  if (stringCloudCart) {
    const cartContainer = getCartCointainer();
    const cloudCartIds = JSON.parse(stringCloudCart);
    
    cloudCartIds.forEach(async (productId) => {
      const filtredInfo = await filterInfoToSendToCart(productId);
      const cartItem = createCartItemElement(filtredInfo);
      cartContainer.append(cartItem);
    });
  }
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const addButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
    addButton.addEventListener('click', (() => addCart(sku)));
    section.appendChild(addButton);

  return section;
}

async function getProducts() {
  const fet = fetch(urlAPI);
     fet
     .then((element) => element.json())
     .then((element) => element.results)
     .then((elem) => elem.forEach((data) => {
       const item = document.querySelector('.items');
      item.appendChild(createProductItemElement({ sku: data.id, 
        name: data.title, 
        image: data.thumbnail }));
     }))
     .then(() => {
       const loading = document.querySelector('.loading');
       loading.remove();
     });
}

function clearCart() {
  const cart = test();
  cart.innerHTML = '';
  updatePrice();
}

// const clearButton = document.querySelector('.empty-cart');
// clearButton.addEventListener('click', clearCart);

window.onload = () => { 
  getProducts();
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', clearCart);
  loadCloudCart();
};

// REPOSITORIOS REFERENCIAS
// Paulo Flora: https://github.com/tryber/sd-015-b-project-shopping-cart/tree/paulo-flora-shopping-cart-project
// Rodrigo Lima: https://github.com/tryber/sd-015-b-project-shopping-cart/tree/rodrigo-lima-shopping-cart
// Danielen Cestari: https://github.com/tryber/sd-015-b-project-shopping-cart/tree/danielencestari-shopping-cart
