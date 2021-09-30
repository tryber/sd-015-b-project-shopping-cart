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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  const evento = event;
  console.log(evento);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addItemtoCart(item) {
  console.log(item);
  fetch(`https://api.mercadolibre.com/items/${item}`)
  .then((response) => response.json())
  .then(({ id, title, price }) => {
    const itemInfo = {
      sku: id,
      name: title,
      salePrice: price,
    };
    const cartList = document.querySelector('.cart__items');
    cartList.appendChild(createCartItemElement(itemInfo));
  });
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const addBttn = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(addBttn);
  addBttn.addEventListener('click', () => addItemtoCart(sku));

  return section;
}

function createObjectProduct(dados) {
  const itemDiv = document.querySelector('.items');
  dados.forEach((dado) => {
    const item = createProductItemElement(dado);
    itemDiv.appendChild(item);
  });
}

function getApi() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((dados) => dados.results)
  .then((results) => createObjectProduct(results));
}

window.onload = () => {
  getApi();
};