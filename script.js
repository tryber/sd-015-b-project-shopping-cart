function search(item) {
  const urlApi = `https://api.mercadolibre.com/sites/MLB/search?q=${item}`;
  return urlApi;
}

async function getApiFetch(item) {
  let listOfProducts = [];
  await fetch(search(item))
  .then((result) => result.json())
  .then((computers) => {
    listOfProducts = computers.results;
  });
  return listOfProducts;
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

async function getProductItem() {
  const array = await getApiFetch('computador');
  array.forEach((element) => {
    const object = {
      sku: element.id,
      name: element.title,
      image: element.thumbnail,
    };
const section = createProductItemElement(object);
const newItem = document.querySelector('.items');
newItem.appendChild(section);
}); 
}

window.onload = () => {
  getProductItem();
};
