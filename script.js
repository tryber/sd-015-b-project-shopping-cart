function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
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

function idToProduct(i) {
  fetch(`https://api.mercadolibre.com/items/${i}`)
  .then((response) => response.json())
  .then(({ id, title, price }) => {
    console.log({ id, title, price });
    const items = document.querySelector('.cart__items');
    items.appendChild(createCartItemElement(
      { sku: id, name: title, salePrice: price },
    ));
  });
}

function getSkuFromProductItem() {
  idToProduct(this.parentNode.querySelector('span.item__sku').innerText);
  return this.parentNode.querySelector('span.item__sku').innerText;  
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', getSkuFromProductItem);
  } 
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

const fetchApi = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computer')
  .then((response) => response.json())
  .then((object) => object.results)
  .then((results) => results.forEach((element) => {
    const computers = document.querySelector('.items');
    computers.appendChild(createProductItemElement(
      { sku: element.id, name: element.title, image: element.thumbnail },
      ));    
  }));
};

window.onload = () => { 
  fetchApi();
};
