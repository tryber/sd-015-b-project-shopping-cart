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

function cartItemClickListener(event) {
  const liCart = document.querySelector('.cart__items');
   
  liCart.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addProductToCart(event) {
  const itemId = event.target.parentNode.firstChild.innerText;
  const responseiTem = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const dataItem = await responseiTem.json();

  const olHTML = document.querySelector('.cart__items');
  const result = { sku: '', name: '', salePrice: '' };

  result.sku = dataItem.id; result.name = dataItem.title; result.salePrice = dataItem.price;
  return olHTML.appendChild(createCartItemElement(result));
}

function buttonEventListener() {
  const addToCartButton = document.querySelectorAll('.item__add');
  for (let i = 0; i < addToCartButton.length; i += 1) {
    addToCartButton[i].addEventListener('click', addProductToCart);
  }
  // addToCartButton.forEach((_, i) => addToCartButton[i].addEventListener('click', addProductToCart));
}

// async function getImgOfProducts(img) {
//   const responseImg = await fetch(`https://api.mercadolibre.com/items/${img}`);
//   const dataImg = await responseImg.json();

//   return dataImg.pictures[0].url;
// } //(async () => { await getImgOfProducts(productObj.id); })()
async function getProducts() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const data = await response.json();
  const divHTMl = document.querySelector('.items');

  data.results.forEach((productObj) => {
    const result = { sku: '', name: '', image: '' };
    result.sku = productObj.id; result.name = productObj.title;
    result.image = productObj.thumbnail;
    const createProducts = divHTMl.appendChild(createProductItemElement(result));
    return createProducts;
  });
}

window.onload = async () => {
  await getProducts();
  buttonEventListener();
  // liCart.appendChild.localStorage.getItem('Cart items');
};