const requestComputer = () =>
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then((responsive) => responsive.json())
    .then((data) => creatObject(data.results)); // capturing objects

function creatObject(data) {
  const divHtml = document.querySelector('.items'); // capturing div by class items
  for (const key in data) {
    const item = createProductItemElement(data[key]); // listing array object
    divHtml.appendChild(item);
  }
}
/* const requestComputerAsync = async () => {
  try {
    await requestComputer('computador');
  } catch (error) {
    console.log('Erro na função Async!');
  }
}; */

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

window.onload = () => {
  requestComputer();
  creatObject();
};
