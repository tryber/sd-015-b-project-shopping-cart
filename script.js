const listClass = '.cart__items';

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

async function priceSummation() {
  let price = 0;
  const totalPrice = document.querySelector('.total-price'); 
  const list = document.querySelector(listClass);
  const listArray = Array.from(list.childNodes);
  await listArray.forEach(async (item) => {
    const productId = item.id;
    await fetch(`https://api.mercadolibre.com/items/${productId}`)
    .then((product) => product.json())
    .then((product) => product.price)
    .then((productPrice) => {
      price += productPrice;
      totalPrice.innerText = price;
    })
    .catch(() => 'not found');
  });  
}

function cartItemsSave() {
   const list = document.querySelector(listClass);
   localStorage.setItem('cart', list.innerHTML);
}

function cartItemClickListener(event) {
  const list = document.querySelector(listClass);
  list.removeChild(event.target);
  cartItemsSave();
  priceSummation();
}

function cartItemsLoad() {
  const list = document.querySelector(listClass);
  if (localStorage.length) list.innerHTML = localStorage.getItem('cart');
  const items = Array.from(list.children);
  items.forEach((item) => item.addEventListener('click', cartItemClickListener));
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = sku;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  return li;
}

async function getProduct(product) {
  const item = product.target.parentElement;
  const itemID = item.firstChild.innerText;
  let productFind;
  
  await fetch(`https://api.mercadolibre.com/items/${itemID}`)
  .then((productItem) => productItem.json())
  .then((productItem) => { productFind = productItem; })
  .catch(() => 'not found');

  const { id, title, price } = productFind;
  const list = document.querySelector(listClass);
  const li = createCartItemElement({ sku: id, name: title, salePrice: price });

  list.appendChild(li);
  cartItemsSave();
  priceSummation();
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  section.lastChild.addEventListener('click', getProduct);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function searchOnMercado(produto) {
  const itemsSection = document.querySelector('.items');
  let searchResults;
  await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${produto}`)
  .then((search) => search.json())
  .then((search) => { searchResults = search.results; })
  .catch(() => 'not found');

  searchResults.forEach((result) => {
    const { id, title, thumbnail } = result;
    itemsSection.appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail }));
  });
}
window.onload = () => {
  searchOnMercado('computador'); 
  cartItemsLoad();
 };
