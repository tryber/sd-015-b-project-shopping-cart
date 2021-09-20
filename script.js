function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
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

function createObjectProduct(dados) {
  const divHTML = document.querySelector('.items');
  // coletar o objeto da api
  const getDados = dados.forEach((element) => {
    const item = createProductItemElement(element);
    divHTML.appendChild(item);
  });
  let buttons = document.querySelectorAll('.item__add');
  console.log(buttons);
  getButton();
  return getDados;
}
// feito durante mentoria com passo a passo da carol
// recolher e requerer api
function getAPI() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
  .then((response) => response.json())
  .then((obj) => createObjectProduct(obj.results));
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// evento
function addItem (event) {
  const button = document.querySelector('button');
  const selecting = () => {
    let sectionItems = document.querySelector('.items');
    sectionItems.className = 'item__add selected';
  }
  button.addEventListener('click', selecting)

}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = () => { 
  getAPI();
};
