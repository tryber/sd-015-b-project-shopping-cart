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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
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

function getElementsItems(result) {
  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(createProductItemElement(result));
}

function getRequest() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  
  fetch(url)
    .then((response) => response.json())
    .then((data) => data.results)
    .then((results) => results.forEach((result) => getElementsItems(result)));
}

window.onload = () => {
  getRequest();
};
