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
const findItems = (product) => {
const API_LINK = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
  fetch(API_LINK)
  .then((response) => response.json())
  .then((obj) => obj.results)
  .then((products) => products.forEach((item) => {
    const items = document.querySelector('.items');
    items.appendChild(createProductItemElement(
      { sku: item.id, name: item.title, image: item.thumbnail },
    ));
  }))
  .catch((erro) => console
  .error(`${erro}: erro na função findItems, possivelmente no link da API`));
};

// console.log(findItem());

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

window.onload = () => {
  findItems('computador');
};
