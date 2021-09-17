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
  // coloque seu código aqui
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchAPI = async (url) => (await fetch(url)).json();

const addToCartEndpoint = async (event) => {
  const currentProduct = event.target.parentElement;
  const itemId = getSkuFromProductItem(currentProduct);
  const url = `https://api.mercadolibre.com/items/${itemId}`;

  const { id: sku, title: name, price: salePrice } = await fetchAPI(url);
  const cartItems = document.querySelector('.cart__items');

  cartItems.append(createCartItemElement({ sku, name, salePrice }));
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;

  if (className === 'item__add') e.addEventListener('click', addToCartEndpoint);

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

const createItemProductSection = async () => {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  try {
    const { results } = await fetchAPI(url);
    const itemsSection = document.querySelector('.items');
    
    results.forEach(({ id, title, thumbnail }) => {
      const itemToRender = createProductItemElement({ sku: id, name: title, image: thumbnail });

      itemsSection.append(itemToRender);
    });
  } catch (e) {
    console.log('Error!!!');
    console.log(e);
  }
};

const emptyCart = () => {
  const listedCartItems = document.querySelector('.cart__items');

  listedCartItems.innerHTML = '';
  localStorage.clear();
};

window.onload = () => {
  createItemProductSection();

  const emptyCartButton = document.querySelector('.empty-cart');
  emptyCartButton.addEventListener('click', emptyCart);
};
