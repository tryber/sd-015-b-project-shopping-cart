const mercadoLivreApi = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// 2. Adicione o produto ao carrinho de compras
async function addProductCart() {
  try {
  const productId = getSkuFromProductItem(this);
  const url = `https://api.mercadolibre.com/items/${productId}`;
  const myFetch = await fetch(url);
  const searchFetch = await myFetch.json();
  const item = { 
    sku: searchFetch.id, 
    name: searchFetch.title, 
    salePrice: searchFetch.price,
  }; 
  const productToCart = createCartItemElement(item);
  const cart = document.querySelector('.cart__items');
  cart.appendChild(productToCart);
  } catch (error) {
    console.log('error');
  }
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.addEventListener('click', addProductCart);
  return section;
}

// 1. Crie uma listagem de produtos
function createProductListing() {
  try {
  const fetchML = fetch(mercadoLivreApi)
  .then((responseThen) => responseThen.json())
  .then((productList) => productList.results.forEach(({ id, title, thumbnail }) => {
      const productObject = {
        sku: id, 
        name: title, 
        image: thumbnail,
      };
    const creationProductElement = createProductItemElement(productObject);
    const section = document.querySelector('.items');
    section.appendChild(creationProductElement);
    }));
  } catch (error) {
    console.log('error');
  }
}

window.onload = () => { 
  createProductListing();
};
