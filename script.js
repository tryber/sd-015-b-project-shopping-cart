async function findDataML() {
  const apiData = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const dataJson = await apiData.json();
  return dataJson;
}

async function findProductMl(id) {
  const apiData = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const dataJson = await apiData.json();
  return dataJson;
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

async function addItemToList(id) {
  const itemOl = document.querySelector('.cart__items');
  const { title, price } = await findProductMl(id);
  const product = {
    sku: id,
    name: title,
    salePrice: price,
  };
  const itemLi = createCartItemElement(product);
  itemOl.appendChild(itemLi);
  }

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', (() => addItemToList(sku)));
  section.appendChild(button);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function addProduct({ id, title, thumbnail }) {
const productItemElement = createProductItemElement({
  sku: id,
  name: title,
  image: thumbnail,
});
const items = document.querySelector('.items');
items.appendChild(productItemElement);
}

window.onload = () => { 
  findDataML().then((jsonData) => {
    const { results } = jsonData;
    results.forEach((result) => addProduct(result));
  });
};
