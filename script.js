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

async function requestPcMl() {
  return fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((listItens) => listItens.results.forEach(({ id, title, thumbnail }) => {
      const output = { 
        sku: id, 
        name: title, 
        image: thumbnail, 
      };
      const selectionItems = document.querySelector('.items');
      const itemElement = createProductItemElement(output);
      selectionItems.append(itemElement);
    }));
}

async function searchId(element) {
  const idElement = getSkuFromProductItem(element);
  return fetch(`https://api.mercadolibre.com/items/${idElement}`)
  .then((response) => response.json())
  .then(({ id, title, price }) => {
    const output = {
      sku: id,
      name: title,
      salePrice: price,
    };
    const ol = document.querySelector('.cart__items');
    ol.append(createCartItemElement(output));
  });
}
function addListenerButton() {
    const allItems = document.querySelectorAll('.item');
  allItems.forEach((item) => item.lastChild
  .addEventListener('click', (() => {
    searchId(item);
  })));
}

function requestApi() {
  requestPcMl()
  .then(() => addListenerButton())
  .catch(() => console.error('Caminho não encontrado'));
}

window.onload = () => { 
  requestApi();
};
