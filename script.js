function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function calculatorNumbers() {
  const li = document.getElementsByTagName('li');
  const span = document.querySelector('.total-price');
  const tt = [...li];
  const resultado = tt.reduce((acc, element) => {
    const numero = element.innerText.split('$');
    return acc + Number(numero[1]);
  }, 0);
span.innerText = resultado;
}

function saveItensInTheNuvem() {
  const li = document.getElementsByTagName('li');
  const arrayDeLi = [...li];
  const arrayDeIds = arrayDeLi.map((element) => element.innerText.split(' ')[1]);
  localStorage.test = JSON.stringify(arrayDeIds);
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

// Cria os produtos HTML

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function cartItemClickListener(event) {
  const ol = document.getElementsByClassName('cart__items')[0];
  ol.removeChild(event.target);
  saveItensInTheNuvem();
  calculatorNumbers();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  const ol = document.getElementsByClassName('cart__items')[0];
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  ol.appendChild(li);
  saveItensInTheNuvem();
  calculatorNumbers();
}

const requestComputerfForId = (param) => {
  fetch(`https://api.mercadolibre.com/items/${param}`)
  .then((retorno) => retorno.json())
  .then((data) => createCartItemElement(data));
 };

function pegaObjeto(event) {
requestComputerfForId(getSkuFromProductItem(event.target.parentNode));
}

const getIdObject = () => {
  const butons = document.querySelectorAll('.item__add');
  butons.forEach((element) => element.addEventListener('click', pegaObjeto));
};

function addItems(param) {
  const itens = document.getElementsByClassName('items')[0];
  const retornoDosPcs = param;

  retornoDosPcs.forEach((element) =>
    itens.appendChild(createProductItemElement(element)));
    getIdObject();
}

const requestComputadorList = () => {
  const items = document.querySelector('.items');
  const span = document.createElement('span');
  span.className = 'loading';
  span.innerText = 'loading...';
  items.appendChild(span);
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => {
    items.removeChild(span);
    return response.json();
  })
  .then((data) => data.results)
  .then((retorno) => addItems(retorno)); 
};

function getInTheNuvem() {
  const chaveLocalStorage = localStorage.getItem('test');
  if (chaveLocalStorage) {
  const arrayDeIds = JSON.parse(chaveLocalStorage);
  arrayDeIds.forEach((element) => requestComputerfForId(element));
  }
  }

  function removeAll() {
    const ol = document.querySelector('.cart__items');
    ol.innerHTML = '';
    calculatorNumbers();
    saveItensInTheNuvem();
  }

  function removeItens() {
    const button = document.querySelector('.empty-cart');
    button.addEventListener('click', removeAll);
  }
window.onload = () => { 
  requestComputadorList();
  getInTheNuvem();
  removeItens();
  calculatorNumbers();
};
