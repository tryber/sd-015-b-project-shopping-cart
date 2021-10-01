const items = document.querySelector('.items');
const totalPrice = document.querySelector('.total-price');
const ol = document.querySelector('.cart__items');
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
let accumulator = 0;
function resolvePriceEquation(price, signal) {
  if (signal === '+') {
    accumulator += price;
  } else if (signal === '-') {
    accumulator -= price;
  }
  totalPrice.innerHTML = accumulator;   
}

function cartItemClickListener(price, event) {
  event.target.remove();
  localStorage.removeItem(price);
  resolvePriceEquation(price, '-');  
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`; 
  li.addEventListener('click', (event) => cartItemClickListener(salePrice, event));
  return li;
}

 async function getStorageData(price, id, title) {
   if (localStorage[price]) {
    const liCart = createCartItemElement({ sku: id, name: title, salePrice: price });
    ol.appendChild(liCart);     
   }      
 }
 function buttonEmptyCart() {
   const emptyCartButton = document.querySelector('.empty-cart');   
  emptyCartButton.addEventListener('click', (element) => {
   const olElement = element.target.nextElementSibling;
   while (olElement.firstChild) {
     olElement.firstChild.remove();
   }
  });
 }

async function getApiItems() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const objectJason = await response.json();
  const objectResults = objectJason.results;  
  const itemsToAppend = objectResults.forEach(({ id, title, thumbnail }) => {
    const itemToAppend = createProductItemElement({ sku: id, name: title, image: thumbnail });
    items.appendChild(itemToAppend);        
  });
  objectResults.forEach(({ price, id, title }) => {
    const stringPrice = JSON.stringify(price);
     getStorageData(stringPrice, id, title);       
  });      
  return objectResults;  
}

async function getItemID(id) {
  const reponse = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const objectJson = await reponse.json();  
  const liCartItem = createCartItemElement({ 
    sku: objectJson.id,
    name: objectJson.title, 
    salePrice: objectJson.price });
  const olCart = document.querySelector('.cart__items');
  localStorage.setItem(`${objectJson.price}`, `${liCartItem.innerText}`);
  olCart.appendChild(liCartItem);
  resolvePriceEquation(objectJson.price, '+');   
}    
async function addCartItem() {
  await getApiItems();  
  const computerItemsButton = document.querySelectorAll('.item__add');
  computerItemsButton.forEach((button) => button.addEventListener('click', (event) => {
  const id = event.target.parentElement.firstChild.innerText;        
  getItemID(id);                
  })); 
}
window.onload = async () => {
  await addCartItem(); 
  buttonEmptyCart(); 
};