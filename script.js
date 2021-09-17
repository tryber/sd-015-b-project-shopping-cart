const products = document.querySelector('.items');

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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

function mapToDesiredObj(result) {
  const abrObject = {
    sku: result.id,
    name: result.title,
    image: result.thumbnail,
  };
  const createdProduct = createProductItemElement(abrObject);
  products.appendChild(createdProduct);
}

function resultsForEach(results) {
  results.forEach((result) => mapToDesiredObj(result));
}

async function get(url) {
  if (url === 'https://api.mercadolibre.com/sites/MLB/search?q=computador') {
    return fetch(url)
      .then((msg) => msg.json())
      .then((response) => response.results)
      .then((results) => resultsForEach(results))
      .catch((err) => err);
  }
  throw new Error('endpoint não existe');
}

get('https://api.mercadolibre.com/sites/MLB/search?q=computador');

// window.onload = () => { };
