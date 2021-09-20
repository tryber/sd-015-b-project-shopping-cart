const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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

/*
  sku === id
  name === title
  image === thumbnail
*/
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

function fetchMercadoLivreAPI() {
  const productSection = document.querySelector('.items');
  const init = {
    method: 'GET',
  };
  fetch(API_URL, init)
    .then((response) => response.json())
    .then((data) => {
      data.results.forEach((product) => {
        const productInfo = {
          sku: product.id,
          name: product.title,
          image: product.thumbnail,
        };
        const element = createProductItemElement(productInfo);
        productSection.appendChild(element);
      });
    })
    .catch(() => console.log('Error: failed to request'));
}

window.onload = () => { 
  fetchMercadoLivreAPI();
};
