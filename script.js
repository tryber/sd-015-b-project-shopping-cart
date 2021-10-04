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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const li = event.target;
  li.parentElement.removeChild(li);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addCart(sku) {
  const response = await fetch(`https://api.mercadolibre.com/items/${sku}`);
  const results = await response.json();
  const name = results.title;
  const salePrice = results.price;
  const cart = createCartItemElement({ sku, name, salePrice });
  document.querySelector('.cart__items').appendChild(cart);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const addButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
    addButton.addEventListener('click', (() => addCart(sku)));
    section.appendChild(addButton);

  return section;
}

function getProducts() {
  const fet = fetch(urlAPI);
     fet
     .then((element) => element.json())
     .then((element) => element.results)
     .then((elem) => elem.forEach((data) => {
       const item = document.querySelector('.items');
      item.appendChild(createProductItemElement({ sku: data.id, 
        name: data.title, 
        image: data.thumbnail }));
     }));
  }

window.onload = () => { 
  getProducts();
};
