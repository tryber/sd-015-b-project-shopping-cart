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

function createOl() {
  return document.querySelector('.cart__items');
}

function saveCartItems() {
  const ol = createOl();
  const olChild = ol.childNodes;
  for (let i = 0; i < olChild.length; i += 1) {
    localStorage.setItem(`line${i}`, `${olChild[i].innerHTML}`);
  }
}

function removeItemFromLocalStorage(evento) {
  for (let i = 0; i < 100; i += 1) {
    if (localStorage[`line${i}`] === `${evento.innerHTML}`) {
      localStorage.removeItem(`line${i}`);
    }
  }
}

function totalSumOfPrices(price) {
  const total = document.querySelector('.total-price');
  let { sum } = sessionStorage;
  sum = parseFloat(sum);
  sum += price;
  sessionStorage.sum = sum;
  total.innerHTML = `${parseFloat(sum)}`;
}

function cartItemClickListener(event) {
  const ol = createOl();
  const str = event.target.innerHTML;
  removeItemFromLocalStorage(event.target);
  ol.removeChild(event.target);
  // PARA DESCOBRIR COMO ACHAR O CIFRÃO ENTREI NA DOCUMENTAÇÃO 
  // link: https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/String/search
  const cifra = /[$]/g;
  const locations = str.search(cifra);
  let price = ['-'];
  for (let i = locations + 1; i < str.length; i += 1) {
    price.push(str[i]);
  }
  price = price.join('');
  price = parseFloat(price);
  totalSumOfPrices(price);
}

function retriveCartItems() {
  for (let i = 0; i < localStorage.length; i += 1) {
    const ol = createOl();
    const li = document.createElement('li');
    li.innerHTML = localStorage.getItem(`line${i}`);
    li.addEventListener('click', cartItemClickListener);
    ol.appendChild(li);
  }
}

function createCartItemElement({ id, name, salePrice }) {
  const ol = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  ol.appendChild(li);
  saveCartItems();
  totalSumOfPrices(salePrice);
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
  retriveCartItems();
  sessionStorage.sum = 0;
 };
