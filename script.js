function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function totalPrice(price, status) {
  const priceTotal = document.querySelector('.total-price');
  console.log(`valor antes - price: ${priceTotal}`);
  let valor = parseFloat(priceTotal.innerText);
  if (status === 'added') valor += price;
  if (status === 'removed') valor -= price;
  if (status === 'clearAll') valor = 0;
  priceTotal.innerText = valor;
  console.log(`valor: ${valor}`);
}

// remove item do carrinho
function cartItemClickListener(event) {
  event.target.remove();
  const salePrice = parseFloat(event.target.innerText.split('$').pop());
  totalPrice(salePrice, 'removed');
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  totalPrice(salePrice, 'added');
  return li;
}

function addCartItem(event) {
  const ItemID = getSkuFromProductItem(event.target.parentElement);
  fetch(`https://api.mercadolibre.com/items/${ItemID}`)
  .then((response) => response.json())
  .then((obj) => {
    const cart = document.querySelector('.cart__items');
    const selectedProduct = createCartItemElement(obj);
    return cart.appendChild(selectedProduct);
  });
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  
  const botao = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  botao.addEventListener('click', addCartItem);
  section.appendChild(botao);
  
  return section;
}

// cria quadradinhos com os produtos
function createObjectProduct(dados) {
  const divHtml = document.querySelector('.items');
  const getDados = dados.forEach((dado) => {
    const item = createProductItemElement(dado);
    divHtml.appendChild(item);
  });
  return getDados;
}

function getAPI() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
  .then((response) => response.json())
  .then((obj) => createObjectProduct(obj.results))
  .then(() => {
    const loading = document.querySelector('.loading');
    loading.remove();
  });
}

// esvazia todo o carrinho
function emptyCart() {
  const cart = document.querySelector('.cart__items');
  cart.innerHTML = '';
  totalPrice(0, 'clearAll');
}

window.onload = () => { 
  getAPI();
  const emptyButton = document.querySelector('.empty-cart');
  emptyButton.addEventListener('click', emptyCart);
};
