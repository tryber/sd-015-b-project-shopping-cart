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

// contituaçao requisito 1 ---------------------------------------------------------

const filtroResultadosObjeto = (data) => {
  const selecionaIten = document.querySelector('.items');
  const obj = {};
  data.forEach((element) => {
    obj.sku = element.id;
    obj.name = element.title;
    obj.image = element.thumbnail;
    const product = createProductItemElement(obj);
    selecionaIten.appendChild(product);
  });
};
  // Inicio usar api requisito 1 Carol monitoria e rafael colombo
const buscarProdutos = (produto) => {
  const produtoPorCategoria = `https://api.mercadolibre.com/sites/MLB/search?q=${produto}`;
  fetch(produtoPorCategoria)
    .then((response) => response.json())
    .then((objeto) => filtroResultadosObjeto(objeto.results));
};
window.onload = function onload() {
  buscarProdutos('computador');
};