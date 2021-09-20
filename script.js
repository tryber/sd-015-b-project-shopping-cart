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

function cartItemClickListener(event) {
  const list = document.querySelector('.cart__items');
  list.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function getProduct(product) {
  const item = product.path[1];
  const itemID = item.firstChild.innerText;
  let productFind;
  
  await fetch(`https://api.mercadolibre.com/items/${itemID}`)
  .then((productItem) => productItem.json())
  .then((productItem) => { productFind = productItem; })
  .catch(() => 'not found');

  const { id, title, price } = productFind;

  const list = document.querySelector('.cart__items');
  const li = createCartItemElement({ sku: id, name: title, salePrice: price });

  list.appendChild(li);

  console.log(id, title, price);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  section.lastChild.addEventListener('click', getProduct);

  //  addButton[addButton.length - 1].addEventListener('click', cartItemClickListener);

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
 };
