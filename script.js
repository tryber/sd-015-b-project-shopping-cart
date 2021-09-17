function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
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

const addProductToCart = async (event) => {
  try {
    const productId = getSkuFromProductItem(event.target.parentElement);
    const fetchPromise = await fetch(`https://api.mercadolibre.com/items/${productId}`);
    const response = await fetchPromise.json();
    const { id, title, price } = response;
    const addCartProduct = createCartItemElement({
      sku: id,
      name: title,
      salePrice: price,
    });
    const getOl = document.querySelector('.cart__items');
    getOl.appendChild(addCartProduct);
  } catch (error) {
    console.log(error);
  }
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (className === 'item__add') e.addEventListener('click', addProductToCart);
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );
  return section;
}

const createListItems = async (query) => {
  try {
    const fetchPromise = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
    const response = await fetchPromise.json();
    const { results } = response;
    results.forEach(({ id, title, thumbnail }) => {
      const objectToReturn = { sku: id, name: title, image: thumbnail };
      const createElement = createProductItemElement(objectToReturn);
      const getSection = document.querySelector('.items');
      getSection.appendChild(createElement);
    });
  } catch (error) {
    console.log(error);
  }
};

const emptyCart = async () => {
  const getOl = document.querySelector('.cart__items');
  getOl.innerHTML = '';
};
const handleEmptyCart = async () => {
  const getEmptyButton = document.querySelector('.empty-cart');
  getEmptyButton.addEventListener('click', emptyCart);
};

window.onload = () => {
  createListItems('computador');
  handleEmptyCart();
};
