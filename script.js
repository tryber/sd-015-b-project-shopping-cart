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

const getCarItemsPrices = async () => {
  const cartItemsElements = document.querySelectorAll('.cart__item');
  const cartItems = Array.from(cartItemsElements);
  const prices = await Promise.all(cartItems.map(async ({ id: sku }) => {
    const { salePrice } = await getProductBySku(sku);
    return salePrice;
  }));
  return prices;
};

const updateTotal = async () => {
  const prices = await getCarItemsPrices();
  const totalPriceElement = document.querySelector('.total-price');
  const total = prices.reduce((acc, price) => acc + price, 0);
  totalPriceElement.innerText = `${total}`;
};

const saveCartOnLocalStorage = () => {
  const cartItems = Array.from(document.getElementsByClassName('cart__item'));
  if (cartItems.length > 0) {
    const cartItemsSkus = cartItems.map((item) => item.id);
    localStorage.setItem('shoppingCart', JSON.stringify(cartItemsSkus));
  } else {
    localStorage.removeItem('shoppingCart');
  }
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
    updateTotal();
  });
  return li;
};

const insertItemInCart = async (itemSku) => {
  const item = await getProductBySku(itemSku);
  const cartItem = createCartItemElement(item);
  document.querySelector('.cart__items').appendChild(cartItem);
  updateTotal();
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

const renderItemsList = async () => {
  const itemList = await getProductsList();
  const allItemsSection = document.querySelector('.items');
  itemList.forEach((item) => {
    allItemsSection.appendChild(createProductItemElement(item));
  });
};

const renderPreviousCartItems = (previousCart) => {
  const previousItemsSkus = JSON.parse(previousCart);
  previousItemsSkus.forEach((itemSku) => {
    insertItemInCart(itemSku);
  });
};

window.onload = () => {
  renderItemsList();
  const previousCart = localStorage.getItem('shoppingCart');
  if (previousCart) {
    renderPreviousCartItems(previousCart);
  }
  
  const clearCartBtn = document.querySelector('.empty-cart');
  clearCartBtn.addEventListener('click', () => clearCart());
};
