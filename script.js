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
const makeRequisiton = (url) => {
  fetch(url)
  .then(response => response.json())
  .then(queryList => queryList.results.forEach( ({ id, title, thumbnail }) => {
    const params = {
      sku: id,
      name: title,
      image: thumbnail
    }

  const sectionItems = document.querySelector('.items');
  const itemElement = createProductItemElement(params);
  sectionItems.append(itemElement)
  }))
}


window.onload = () => {
  makeRequisiton("https://api.mercadolibre.com/sites/MLB/search?q=computador");
 };
