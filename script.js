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

const createAndAddItemToCart = (data) => {
  const cartElement = createCartItemElement({
    sku: data.id,
    name: data.title,
    salePrice: data.price,
  });
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(cartElement);
};

const saveItemToStorage = (item) => {
  const storageItems = JSON.parse(localStorage.getItem('cartItems'));
  if (storageItems) {
    storageItems.push(item);
    localStorage.setItem('cartItems', JSON.stringify(storageItems));
  } else {
    localStorage.setItem('cartItems', JSON.stringify([item]));
  }
};

const getCartFromLocalStorage = () => {
  const storedItems = JSON.parse(localStorage.getItem('cartItems'));
  if (storedItems) {
    storedItems.forEach((item) => createAndAddItemToCart(item));
  }
};

const addItemToCart = (itemId) => {
  fetch(`https://api.mercadolibre.com/items/${itemId}`)
    .then((response) => response.json())
    .then((data) => {
      createAndAddItemToCart(data);
      saveItemToStorage(data);
    });
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));

  const addButton = createCustomElement(
    'button',
    'item__add',
    'Adicionar ao carrinho!',
  );
  addButton.addEventListener('click', () => addItemToCart(sku));
  section.appendChild(addButton);

  return section;
}

const getProducts = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((data) => {
      data.results.forEach(({ id, title, thumbnail }) => {
        const productInfo = { sku: id, name: title, image: thumbnail };
        const carItems = document.querySelector('.items');
        const productsList = createProductItemElement(productInfo);
        carItems.appendChild(productsList);
      });
    });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

window.onload = () => {
  getProducts();
  getCartFromLocalStorage();
};