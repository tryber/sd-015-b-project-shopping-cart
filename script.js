const items = document.querySelector('.items');
const ol = document.querySelector('.cart__items');
const loading = document.querySelector('.loading');
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
  const totalPrice = document.querySelector('.total-price');
  if (signal === '+') {
    accumulator += price;
  } else if (signal === '-') {
    accumulator -= price;
  }
  totalPrice.innerHTML = accumulator;   
}
function updateLocalStorage() {  
  localStorage.setItem('OlItems', ol.innerHTML);  
}

function cartItemClickListener(price, event) {
  event.target.remove(); 
  updateLocalStorage();  
  resolvePriceEquation(price, '-');   
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
function remElement(evento) {
  evento.target.remove();   
}
function startLocalStorage() {
  const storageOlItems = localStorage.getItem('OlItems');   
  ol.innerHTML = storageOlItems;   
  ol.childNodes.forEach((li) => li.addEventListener('click', remElement));
  buttonEmptyCart();   
}
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`; 
  li.addEventListener('click', (event) => cartItemClickListener(salePrice, event));
  return li;
}

async function getItemID(id) {
  const reponse = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const objectJson = await reponse.json();  
  const liCartItem = createCartItemElement({ 
    sku: objectJson.id,
    name: objectJson.title, 
    salePrice: objectJson.price,
   });
    const olCart = document.querySelector('.cart__items');            
    olCart.appendChild(liCartItem);
    updateLocalStorage(); 
    resolvePriceEquation(objectJson.price, '+');    
}

 function addCartItem() {    
   const computerItemsButton = document.querySelectorAll('.item__add');
   computerItemsButton.forEach((button) => button.addEventListener('click', (event) => {
   const id = event.target.parentElement.firstChild.innerText;        
   getItemID(id);                
   }));  
 }
 async function getApiItems() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const objectJason = await response.json();
  const objectResults = objectJason.results; 
  loading.remove(); 
  objectResults.forEach(({ id, title, thumbnail }) => {
    const itemToAppend = createProductItemElement({ sku: id, name: title, image: thumbnail });
    items.appendChild(itemToAppend);        
  });
  addCartItem();  
}
window.onload = () => { 
  getApiItems();   
  startLocalStorage(); 
};