async function searchMercadoLivre() {
  const apiProducts = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const productsJson = await apiProducts.json();
  return productsJson;
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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

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

window.onload = () => { 
  searchMercadoLivre().then((jsonData) => {
    const { results } = jsonData;
    results.forEach((result) => addProducts(result));
  });
};
