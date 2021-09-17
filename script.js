const getProductsList = async () => {
  const wantedProduct = 'computador';
  const API_URL = `https://api.mercadolibre.com/sites/MLB/search?q=${wantedProduct}`;
  try { 
    const data = await fetch(API_URL);
    const translatedData = await data.json();
    const productsList = translatedData.results;
    const treatedProductsList = productsList.map((product) => ({
        sku: product.id,
        name: product.title,
        image: product.thumbnail,
      }));
    return treatedProductsList;
  } catch (error) {
    console.log(error);
  }
};

const getProductBySku = async (sku) => {
  const API_URL = `https://api.mercadolibre.com/items/${sku}`;
  try {
    const data = await fetch(API_URL);
    const translatedData = await data.json();
    const productItem = {
      sku: translatedData.id,
      name: translatedData.title,
      salePrice: translatedData.price,
    };
    return productItem;
  } catch (error) {
    console.log(error);
  }
};

const saveCartOnLocalStorage = () => {
  const cartItems = Array.from(document.getElementsByClassName('cart__item'));
  const cartItemsSkus = cartItems.map((item) => item.id);
  localStorage.setItem('shoppingCart', JSON.stringify(cartItemsSkus));
};

const clearCart = () => {
  const cart = document.querySelector('.cart__items');
  cart.innerHTML = '';
  saveCartOnLocalStorage();
};

const createImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.id = sku;
  li.addEventListener('click', (event) => {
    event.target.remove();
    saveCartOnLocalStorage();
  });
  return li;
};

const insertItemInCart = async (itemSku) => {
  const item = await getProductBySku(itemSku);
  const cartItem = createCartItemElement(item);
  document.querySelector('.cart__items').appendChild(cartItem);
};

const createProductItemElement = ({ sku, name, image }) => {
  const itemSection = document.createElement('section');
  itemSection.className = 'item';

  itemSection.appendChild(createCustomElement('span', 'item__sku', sku));
  itemSection.appendChild(createCustomElement('span', 'item__title', name));
  itemSection.appendChild(createImageElement(image));

  const addItemBtn = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  addItemBtn.addEventListener('click', async (event) => {
    const itemSku = event.target.parentElement.querySelector('span.item__sku').innerText;
    await insertItemInCart(itemSku);
    saveCartOnLocalStorage();
  });

  itemSection.appendChild(addItemBtn);
  return itemSection;
};

const renderItemsList = async (itemList) => {
  const allItemsSection = document.querySelector('.items');
  itemList.forEach((item) => {
    allItemsSection.appendChild(createProductItemElement(item));
  });
};

const renderPreviousCartItems = async (previousCart) => {
  const previousItemsSkus = JSON.parse(previousCart);
  previousItemsSkus.forEach(async (itemSku) => insertItemInCart(itemSku));
};

window.onload = async () => {
  const clearCartBtn = document.querySelector('.empty-cart');
  clearCartBtn.addEventListener('click', () => clearCart());

  const list = await getProductsList();
  renderItemsList(list);

  const previousCart = localStorage.getItem('shoppingCart');
  if (previousCart.length > 0) {
    renderPreviousCartItems(previousCart);
  }
};
