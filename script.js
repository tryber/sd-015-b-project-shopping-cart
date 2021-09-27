const localStorageKart = JSON.parse(localStorage.getItem('Kart'));
let itensKart = localStorage.getItem('Kart') !== null ? localStorageKart : [];
const ol = document.querySelector('.cart__items');

function updateLocalStorage() {
  localStorage.setItem('Kart', JSON.stringify(itensKart));
}

function removeItemLocalStorage(text) {
  itensKart = itensKart.lenght === 1 ? itensKart = [] : itensKart
    .filter((element) => element !== text);
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

function cartItemClickListener() {
  removeItemLocalStorage(this.innerText);
  ol.removeChild(this);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  
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
    itensKart.push(`SKU: ${id} | NAME: ${title} | PRICE: $${price}`);
    updateLocalStorage();
  });
}

function getKartLocalStorage() {
  localStorageKart.forEach((element) => {
    const li = document.createElement('li');
    li.innerText = element;
    li.addEventListener('click', cartItemClickListener);
    ol.appendChild(li);
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

window.onload = () => {
  fetchGetComputers()
    .then((response) => {
      response.forEach(({ id, title, thumbnail }) => {
        const section = document.querySelector('.items');
        section.appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail }));
      });
    })
    .then(() => {
      updateLocalStorage();
      addListenerIten();
    })
    .then(() => {
      getKartLocalStorage();
    });
};
