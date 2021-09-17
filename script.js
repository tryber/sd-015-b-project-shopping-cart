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
  console.log(event);
}

function createCartItemElement({ sku, name, salePrice }) {
  console.log()
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function getProductsList() {
  const query = 'computador'
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=$${query}`;
  const reponse = await fetch(url);
  const jsonResponse = await reponse.json();
  const resultsList = await jsonResponse.results; 
  return resultsList
}

function addElementToParent(element, parentSelector) {
  const parentElment = document.querySelector(parentSelector);
  parentElment.appendChild(element);
}

window.onload = async () => {
  const productsList = await getProductsList();
  productsList.forEach((product) => {
    const { id, title, price } = product;
    const element = createProductItemElement({ sku: id, name: title, salePrice: price })
    addElementToParent(element, ('section.items'));
  })
};
