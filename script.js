const mercadoLivreApi = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const queryCart = '.cart__items';

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

// 5. Some o valor total dos itens do carrinho de compras
function calculeSumPrice() {
  const allItemsCart = document.querySelectorAll('.cart__item');
  const amountPrice = document.querySelector('.total-price');
  let totalPrice = 0;

  for (let index = 0; index < allItemsCart.length; index += 1) {
    const price = allItemsCart[index];
    const getPrice = price.getAttribute('price');
    totalPrice += parseFloat(getPrice);  
  }

  amountPrice.innerText = totalPrice;
}

// 3. Remova o item do carrinho de compras ao clicar nele
function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove(event);
  calculeSumPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.setAttribute('price', salePrice);
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// 2. Adicione o produto ao carrinho de compras
// A linha 37 foi feito com referencia ao codigo da Annie Haurani, segue o link do repositorio: https://github.com/tryber/sd-015-b-project-shopping-cart/pull/60/commits/217276490c68d9bb5def076fea3a70ccf8099784
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
  const cart = document.querySelector(queryCart);
  cart.appendChild(productToCart);
  calculeSumPrice();
  const searchOl = document.querySelector(queryCart);
  localStorage.setItem('content', searchOl.innerHTML);
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
  fetch(mercadoLivreApi)
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

// 4. Carregue o carrinho de compras através do LocalStorage ao iniciar a página (Cria função para chamar no window.onload)
function loadCart() {
  const searchOlCart = document.querySelector(queryCart);
  if (localStorage.getItem('content')) {
    searchOlCart.innerHTML = localStorage.getItem('content');
    searchOlCart.addEventListener('click', cartItemClickListener);
  }
  calculeSumPrice();
}

window.onload = () => { 
  createProductListing();
  loadCart();
};
