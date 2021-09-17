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

async function itemObjectPromise(id) {
  return fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((result) => result.json())
    .then((resultJson) => resultJson)
}

function addElementToCart(event) {
  const element = event.target.parentNode;
  const elementId = getSkuFromProductItem(element);
  itemObjectPromise(elementId)
    .then((object) => {
      const { id: sku, title:name, base_price: salePrice } = object;
      const listItem = createCartItemElement({ sku, name, salePrice });
      document.querySelector('ol.cart__items').appendChild(listItem);
    });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.lastChild.addEventListener('click', addElementToCart);
  return section;
}

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

const computersArrayPromise = new Promise((resolve, _) => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((result) => result.json())
    .then((resultJson) => resolve(resultJson.results));
});

window.onload = () => {
  const sectionItemsElement = document.querySelector('section.items');
  computersArrayPromise
    .then((results) => {
      results.forEach((element) => {
        const { id: sku, title: name, thumbnail: image } = element;
        const newElement = createProductItemElement({ sku, name, image });
        sectionItemsElement.appendChild(newElement);
      });
    });
};
