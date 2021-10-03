const urlAPI = 'https://api.mercadolibre.com/sites/MLB/search?q=$computer';

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
  const a = document.querySelector('.cart__items');
  return event.appendChild(a);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getProducts() {
const fet = fetch(urlAPI);
   fet
   .then((element) => element.json())
   .then((element) => element.results)
   .then((elem) => elem.forEach((x) => {
     const item = document.querySelector('.items');
     item.appendChild(createProductItemElement({ sku: x.id, name: x.title, image: x.thumbnail }));
   }));
}
window.onload = () => { 
  getProducts();
};
