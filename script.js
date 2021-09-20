const urlApi = ('https://api.mercadolibre.com/sites/MLB/search?q=$computador');

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
  event.target.remove();
}

function limparCart() {
  const ol = document.createElement('ol');
  const olCart = document.querySelector('.cart__items');
  const section = document.querySelector('.cart');
  
  olCart.remove();
  
  ol.classList.add('cart__items');
  section.append(ol); 
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__items';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addItem(element) {
  const idProduto = getSkuFromProductItem(element);
  const itemApi = `https://api.mercadolibre.com/items/${idProduto}`;
  
  return fetch(itemApi)
    .then((response) => response.json())
    .then(({ id, title, price }) => {
      const carList = {
        sku: id, 
        name: title,
        salePrice: price,
      };
      const carItem = document.querySelector('.cart__items');
      carItem.appendChild(createCartItemElement(carList));
    });
}

function criarEventButton() {
  const section = document.querySelectorAll('.item');

  section.forEach((carItem) => carItem.lastChild
    .addEventListener('click', (() => {
      addItem(carItem);
    })));
}

async function getUrl(url) {
  return fetch(url)
    .then((getJson) => getJson.json())
    .then((getSearch) => getSearch.results
      .forEach(({ id, title, thumbnail }) => {
        const items = {
          sku: id,
          name: title,
          image: thumbnail,
        };
      const selecionaItem = document.querySelector('.items');
      const criaItem = createProductItemElement(items);
      selecionaItem.append(criaItem);
    }));
}

window.onload = () => { 
  getUrl(urlApi)
    .then(() => criarEventButton());
    const botao = document.querySelector('.empty-cart');
    botao.addEventListener('click', limparCart);
};
