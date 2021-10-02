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
  const itemHtml = document.querySelector('.items');
  const appendItem = itemHtml.appendChild(section);

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return appendItem;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
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

const fetchComputer = () => fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((objeto) => objeto.results.forEach(({ id, title, thumbnail }) => {
      const carObj = {
        sku: id,
        name: title,
        image: thumbnail,
      };
      const foundItems = document.querySelector('.items');
      const item = createProductItemElement(carObj);
      foundItems.appendChild(item);
    }));

const fetchId = (item) => {
  const urlId = getSkuFromProductItem(item);
  return fetch(`https://api.mercadolibre.com/items/${urlId}`)
  .then((response) => response.json())
  .then(({ id, title, price }) => {
    const objDetails = {
      sku: id,
      name: title,
      salePrice: price,
    };
    const foundCartItems = document.querySelector('.cart__items');
    foundCartItems.appendChild(createCartItemElement(objDetails));
  });
};

const addCartItem = () => {
  const allItems = document.querySelectorAll('.item');
  allItems.forEach((item) => item.lastChild.addEventListener('click', () => fetchId(item)));
};

const cartItem = () => {
  const itemsCart = document.querySelectorAll('.cart__item');
  return itemsCart;
};

const removeAll = () => {
  const allCartItems = cartItem();
  allCartItems.forEach((li) => li.remove());
};

const addButton = () => {
  const removeButton = document.querySelector('.empty-cart');
  removeButton.addEventListener('click', removeAll);
};

const removeLoading = () => {
  const loadingHtml = document.querySelector('.loading');
  loadingHtml.remove();
};

window.onload = () => {
  fetchComputer()
  .then(() => addCartItem())
  .then(() => addButton())
  .then(() => removeLoading());
  removeAll();
};