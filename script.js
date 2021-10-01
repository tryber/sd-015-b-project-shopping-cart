const items = document.querySelector('.items');
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
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
// function getitemsAppended() {
//   const item = document.querySelectorAll('.item');
//   console.log(item);
// }

async function getApiItems() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const objectJason = await response.json();
  const objectResults = objectJason.results;  
  const itemsToAppend = objectResults.forEach(({ id, title, thumbnail }) => {
    const itemToAppend = createProductItemElement({ sku: id, name: title, image: thumbnail });
    items.appendChild(itemToAppend);
  }); 
  return objectResults;  
}

async function getItemID(id) {
  const reponse = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const objectJson = await reponse.json();
  console.log(objectJson);
  const liCartItem = createCartItemElement({ 
    sku: objectJson.id,
    name: objectJson.title, 
    salePrice: objectJson.price });
  const olCart = document.querySelector('.cart__items');
  olCart.appendChild(liCartItem);
}    
async function addCartItem() {
  await getApiItems();
  const computerItemsButton = document.querySelectorAll('.item__add');
  console.log(computerItemsButton);
  computerItemsButton.forEach((button) => button.addEventListener('click', (event) => {
    const id = event.target.parentElement.firstChild.innerText;    
    getItemID(id);                
  }));
}
window.onload = async () => {
  addCartItem();           
};