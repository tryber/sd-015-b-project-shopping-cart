async function searchMercadoLivre() {
  const apiProducts = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const productsJson = await apiProducts.json();
  return productsJson;
}

async function productMercadoLivre(id) {
  const apiProduct = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const productJson = await apiProduct.json();
  return productJson;
}

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

async function addToList(id) {
  const ol = document.querySelector('.cart__items');
  const { title, price } = await productMercadoLivre(id);
  const object = {
    sku: id,
    name: title,
    salePrice: price,
  };
  const li = createCartItemElement(object);
  ol.appendChild(li);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', (() => addToList(sku)));
  section.appendChild(button);
  return section;
}

function addProducts({ id, title, thumbnail }) {
  const productElementItem = createProductItemElement({
    sku: id,
    name: title,
    image: thumbnail,
  });
  const items = document.querySelector('.items');
  items.appendChild(productElementItem);
}
window.onload = () => { 
  searchMercadoLivre().then((jsonData) => {
    const { results } = jsonData;
    results.forEach((result) => addProducts(result));
  });
};
