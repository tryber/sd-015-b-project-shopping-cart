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

const requireApi = async (QUERY) => 
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`)
  .then((response) => response.json()).then((value) => value.results)
  .catch((error) => console.log(error));

function createProductItemElement({ id, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  const items = document.querySelector('.items');
  items.appendChild(section);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function cartItemClickListener(event) {
  const ol = document.querySelector('.cart__items');
  ol.removeChild(event.target);
}

function createCartItemElement({ id, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  const ol = document.querySelector('.cart__items');
  ol.appendChild(li);
  return li;
}

function addEventListenerToButtons() {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const pai = event.target.parentNode;
      const idDoBotaoClicado = pai.firstChild.innerText;
      fetch(`https://api.mercadolibre.com/items/${idDoBotaoClicado}`)
      .then((resultado) => resultado.json())
      .then((pronto) => {
        const { id, title: name, price: salePrice } = pronto;
        createCartItemElement({ id, name, salePrice });
      });
    });
  });
}

async function requireAndCreateEachProduct() {
  const requisicao = requireApi('computador');
  const done = await requisicao;
  done.forEach((product) => {
    const { title: name, id, thumbnail: image } = product;
    createProductItemElement({ id, name, image });
  });
  addEventListenerToButtons();
}

window.onload = () => {
  requireAndCreateEachProduct();
 };
