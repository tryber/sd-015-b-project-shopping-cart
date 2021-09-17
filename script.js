const mercadoLivreApi = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function requestMlComputador(url) {
  return fetch(url)
    .then((response) => response.json())
    .then((listSearch) => listSearch.results.forEach(({ id, title, thumbnail }) => {
      const output = {
        sku: id,
        name: title,
        image: thumbnail,
      };
      const sectionItems = document.querySelector('.items');
      const itemElement = createProductItemElement(output);
      sectionItems.append(itemElement);
    }));
}

async function takeComputerID(element) {
  const elementId = getSkuFromProductItem(element);
  const mercadoLivreApiPeloId = `https://api.mercadolibre.com/items/${elementId}`;

  return fetch(mercadoLivreApiPeloId)
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

function addListenersToBtns() {
  const allItems = document.querySelectorAll('.item');
  
  allItems.forEach((item) => item.lastChild.addEventListener('click', (() => {
    takeComputerID(item);
  })));
}

function execOrder() {
  requestMlComputador(mercadoLivreApi)
    .then(() => addListenersToBtns())
    .catch(() => console.error('Opa, esse endereço não foi encontrado.'));
}

window.onload = () => {
  execOrder();
};
