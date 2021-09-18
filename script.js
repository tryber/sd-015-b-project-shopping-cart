const searchGroupProducts = 'https://api.mercadolibre.com/sites/MLB/search?q=';
const searchSpecificProduct = 'https://api.mercadolibre.com/items/';

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

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
  sendCartToCloud();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function getItemsFromApi(api, product) {
  const apiProduct = await fetch(api + product);
  const response = await apiProduct.json();

  return (response);
}

async function sendToCart(event) {
  const productContainer = event.target.parentNode;
  const textId = getSkuFromProductItem(productContainer);
  const cartContainer = document.querySelector('.cart__items');
  const itemDetails = await getItemsFromApi(searchSpecificProduct, textId);
  const { id, title, price } = itemDetails;
  const searchResult = { sku: id, name: title, salePrice: price };
  const cartItem = createCartItemElement(searchResult);
  
  cartContainer.appendChild(cartItem);
  sendCartToCloud();
}

function loadCloudCart() {
  const stringCloudCart = localStorage.getItem('cart-items-ids');
  if (stringCloudCart) {
    const cartContainer = document.querySelector('.cart__items');
    const cloudCartIds = JSON.parse(stringCloudCart);

    cloudCartIds.forEach(async (productId) => {
      const itemDetails = await getItemsFromApi(searchSpecificProduct, productId);
      const { id, title, price } = itemDetails;
      const searchResult = { sku: id, name: title, salePrice: price };
      const cartItem = createCartItemElement(searchResult);
      cartContainer.append(cartItem);
    });
  }
}

function getProductsButtons() {
  const buttons = document.querySelectorAll('.item__add');

  buttons.forEach((button) => {
    button.addEventListener('click', sendToCart);
  });
}

async function appendListItems() {
  const container = document.querySelector('.items');
  const research = await getItemsFromApi(searchGroupProducts, 'computador');
  
  research.results.forEach(({ id, title, thumbnail }) => {
    const productInfo = { sku: id, name: title, image: thumbnail };

    container.appendChild(createProductItemElement(productInfo));
  });

  getProductsButtons();
}

window.onload = () => {
  appendListItems();
  loadCloudCart();
};