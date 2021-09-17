const URL_API = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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

function createProductItemElement({ id, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function requestAPIComputer() {
  const fetchAPI = await fetch(URL_API);
  const result = await fetchAPI.json();
  return result;
}

function addProduct(product) {
  const section = document.querySelector('.items');
  const productOne = product.results.forEach(({ id, title, thumbnail }) => {
    const createElement = createProductItemElement({ sku: id, name: title, image: thumbnail });
    section.appendChild(createElement);
  });
  console.log(productOne);
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ id, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = async () => { 
  try {
    const product = await requestAPIComputer();
    addProduct(product);
  } catch (error) {
    console.log(error);
  }
};
