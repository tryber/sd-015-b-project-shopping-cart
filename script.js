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

function forInApi(dados) {
  for (const key in dados) {
      const element = dados[key];
      const produto = {
        sku: element.id,
        name: element.title,
        image: element.thumbnail,
      };
      const sectionElement = document.querySelector('.items');
      sectionElement.appendChild(createProductItemElement(produto));
  }
}

function getAPI() {
   fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
  .then((resposta) => resposta.json())
  .then((dados) => forInApi(dados.results));
}

function getCartAPI(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((resposta) => resposta.json())
  .then((dados) => forInApi(dados.results));
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function buttonAddCart() {
  const addToCart = document.querySelector('.item__add');
  const olCart = document.querySelector('.cart__items');
  addToCart.addEventListener('click', )
}

window.onload = () => {
  getAPI();
  // console.log(createCartItemElement({sku: 'MLB1341706310', name: 'Processador Amd Ryzen 5 2600 6 Núcleos 64 Gb', salePrice: '879' }));
};
