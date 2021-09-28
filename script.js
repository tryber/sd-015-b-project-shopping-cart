const localStorageKart = JSON.parse(localStorage.getItem('Kart'));
let itensKart = localStorage.getItem('Kart') !== null ? localStorageKart : [];
const ol = document.querySelector('.cart__items');
const sectionPrice = document.querySelector('.total-price');
const button = document.querySelector('.empty-cart');
const liS = document.getElementsByClassName('cart__item');

function updateLocalStorage() {
  localStorage.setItem('Kart', JSON.stringify(itensKart));
}

function sumPriceKart(price) {
  let valor = 0;
  if (sectionPrice.innerText !== '') {
    valor = parseFloat(sectionPrice.innerText);
  }
  const sum = valor + price;
  sectionPrice.innerText = sum.toFixed(2);
}

function subPriceKart(price) {
  let valor = 0;
  if (sectionPrice.innerText !== '') {
    valor = parseFloat(sectionPrice.innerText);
  }
  const sum = valor - price;
  sectionPrice.innerText = sum.toFixed(2);
}

function removeItemLocalStorage(sku, price) {
  if (itensKart.lenght === 1) {
    itensKart = [];
  }
  itensKart = itensKart.filter(([id]) => id[1] !== sku);
  subPriceKart(price);
  updateLocalStorage();
}

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

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', () => {
    removeItemLocalStorage(sku, salePrice);
    ol.removeChild(li);
  });
  return li;
}

const fetchGetComputers = () => {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';

  const fetcH = fetch(url)
    .then((response) => response.json())
    .then((computers) => {
      const lista = computers.results.reduce((previousValue, currentValue) => {
        previousValue.push(currentValue);
        return previousValue;
      }, []);
      return lista;
    });
  return fetcH;
};

function getFetchItenId(idItem) {
  const url = `https://api.mercadolibre.com/items/${idItem}`;

  fetch(url)
    .then((response) => response.json())
    .then(({ id, title, price }) => {
      ol.appendChild(createCartItemElement({ sku: id, name: title, salePrice: price }));
      itensKart.push(Object.entries({ sku: id, name: title, salePrice: price }));
      sumPriceKart(price);
      updateLocalStorage();
    });
}

function getKartLocalStorage() {
  localStorageKart.forEach(([id, title, price]) => {
    ol.appendChild(createCartItemElement({ sku: id[1], name: title[1], salePrice: price[1] }));
    sumPriceKart(price[1]);
  });
}

function addListenerIten() {
  const produtos = [...document.getElementsByClassName('item')];
  produtos.forEach((element) => {
    element.childNodes[3].addEventListener('click', () => {
      getFetchItenId(getSkuFromProductItem(element));
    });
  });
}

function cleraKart() {
  localStorageKart.forEach(() => {
    console.log('apagou');
    ol.removeChild(liS[0]);
  });
  itensKart = [];
  updateLocalStorage();
  sectionPrice.innerText = '';
}

function h1Loanding() {
  const h1 = document.createElement('h1');
  h1.className = 'loading';
  h1.innerText = 'loading...';
  document.body.appendChild(h1);
}
function removeH1Loadind() {
  const h1 = document.querySelector('.loading');
  document.body.removeChild(h1);
}

window.onload = () => {
  button.addEventListener('click', cleraKart);
  h1Loanding();
  fetchGetComputers()
    .then((response) => {
      response.forEach(({ id, title, thumbnail }) => {
        const section = document.querySelector('.items');
        section.appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail }));
      });
      removeH1Loadind();
    })
    .then(() => {
      updateLocalStorage();
      addListenerIten();
    })
    .then(() => {
      getKartLocalStorage();
    });
};
