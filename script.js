const strListCartHTML = '.cart__items';

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

function clearCart() {
const rmAllListOfCart = document.querySelector('.empty-cart');
const listCartHTML = document.querySelector(strListCartHTML);

rmAllListOfCart.addEventListener('click', () => {
  listCartHTML.innerHTML = ''; 
});
}
  
function initialRenderization() {
  const listCartHTML = document.querySelector(strListCartHTML);

  if (localStorage.getItem('Cart List') === null) {
    localStorage.setItem('Cart List', JSON.stringify([]));
  } else {
    const productsList = JSON.parse(localStorage.getItem('Cart List'));
    const listLength = productsList.length - 1;
    for (let index = 0; index <= listLength; index += 1) {
      const listElement = document.createElement('li');
      listElement.className = 'cart__item';
      listElement.innerText = productsList[index];
      listCartHTML.appendChild(listElement);
    }
  }
}

function addToLocalStorage(li) {
  const storageListCart = JSON.parse(localStorage.getItem('Cart List'));
  const productText = li.innerText;
  storageListCart.push(productText);
  localStorage.setItem('Cart List', JSON.stringify(storageListCart));
}

function rmProductToStorage() {
  const productCartHTML = document.querySelectorAll('.cart__item');
  localStorage.removeItem('Cart List');
  localStorage.setItem('Cart List', JSON.stringify([]));
  for (let index = 0; index <= productCartHTML.length - 1; index += 1) {
    addToLocalStorage(productCartHTML[index]);
  }
}

function cartItemClickListener(event) {
  const listCartHTML = document.querySelector(strListCartHTML);
  listCartHTML.removeChild(event.target);
  rmProductToStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function addProductToCart(event) {
  const itemId = getSkuFromProductItem(event.target.parentNode);
  const responseiTem = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const dataItem = await responseiTem.json();

  const listCartHTML = document.querySelector(strListCartHTML);
  const result = { sku: '', name: '', salePrice: '' };

  result.sku = dataItem.id; result.name = dataItem.title; result.salePrice = dataItem.price;
  return listCartHTML.appendChild(createCartItemElement(result));
}

function buttonEventListener() {
  const cartButtons = document.querySelectorAll('.item__add');
  const listCartHTML = document.querySelector(strListCartHTML);
  
  for (let i = 0; i < cartButtons.length; i += 1) {
  cartButtons[i].addEventListener('click', addProductToCart);
  }
  listCartHTML.addEventListener('click', cartItemClickListener); 
}

async function getProducts() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const data = await response.json();
  const listCartHTML = document.querySelector('.items');

  data.results.forEach((productObj) => {
    const result = { sku: '', name: '', image: '' };
    result.sku = productObj.id; result.name = productObj.title;
    result.image = productObj.thumbnail;
    const createProducts = listCartHTML.appendChild(createProductItemElement(result));
    return createProducts;
  });
}

window.onload = async () => {
  await getProducts();
  initialRenderization();
  buttonEventListener();
  clearCart();
};