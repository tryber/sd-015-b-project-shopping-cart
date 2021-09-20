// ..........................................................................................
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

function creatObject(dados) {
  const divHtml = document.querySelector('.items'); // capturing div by class items
  dados.forEach((element) => {
    const item = createProductItemElement(element);
    divHtml.appendChild(item);
  });
}
/* for (const key in dados) {
  const item = createProductItemElement(dados[key]); // listing array object
  divHtml.appendChild(item);
} */

function requestComputer() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
  .then((responsive) => responsive.json())
  .then((dados) => creatObject(dados.results)); // capturing objects
}
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(_event) {
  // coloque seu código aqui
  
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = () => {
  requestComputer();
};
