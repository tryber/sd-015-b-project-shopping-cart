async function fetchProductList() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const endpointFormat = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };

  const productList = fetch(endpoint, endpointFormat)
    .then((response) => response.json())
    .then((data) => data.results);

    return productList;
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function transformProductList() {
  const productList = await fetchProductList()
    .then((list) => list.map((item) => ({
      sku: item.id,
      name: item.title,
      image: item.thumbnail })));

  return productList;
}

async function createProductList() {
  const itemsDisplay = document.querySelector('.items');

  const productList = await transformProductList()
    .then((list) => list.forEach((item) => {
      const productItemElement = createProductItemElement(item);
      itemsDisplay.appendChild(productItemElement);
    }));
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
  console.log(createProductList());
};
