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
 
async function totalPrice() {
  const reponse = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  const computers = await reponse.json();
  const lis = document.querySelectorAll('li');
  const resultTotalPrice = [];
  lis.forEach((li) => {
    const computersKeys = Object.keys(computers.results);
    const selected = computersKeys.find((computer) => li.id === computers.results[computer].id);
    resultTotalPrice.push(computers.results[selected].price);
  });
  const priceTotal = resultTotalPrice.reduce((acc, curr) => acc + curr, 0);
  const spanTotalPrice = document.querySelector('.total-price');
  spanTotalPrice.innerHTML = priceTotal;
}

function cartItemClickListener(event) {
  event.target.remove();
  totalPrice();
}

function clearCart() {
  const buutonClear = document.querySelector('.empty-cart');
  const lis = document.querySelectorAll('li');
  buutonClear.addEventListener('click', () => {
    lis.forEach((li) => li.remove());
    totalPrice();
  });
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.id = sku;
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function searchComputer(item) {
  const ol = document.querySelector('.cart__items');
  const reponse = await fetch(`https://api.mercadolibre.com/items/${item}`);
  const infoComputer = await reponse.json();
  const objInfoComputer = { 
    sku: infoComputer.id,
    name: infoComputer.title,
    salePrice: infoComputer.price,
  };
  ol.appendChild(createCartItemElement(objInfoComputer));
  clearCart();
  totalPrice();
}

function addToCard() {
  const items = document.querySelectorAll('.item');
  items.forEach((item) => {
    const button = item.querySelector('button');
    button.addEventListener('click', () => {
      searchComputer(item.querySelector('.item__sku').innerHTML);
    });
  });
}

async function fetchComputers() {
  const reponse = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  const computers = await reponse.json();
  const sectionItems = document.querySelector('.items');
  Object.keys(computers.results).forEach((computer) => {
    const objComputer = {
      sku: computers.results[computer].id,
      name: computers.results[computer].title,
      image: computers.results[computer].thumbnail,
    };
    sectionItems.appendChild(createProductItemElement(objComputer));
  });
  addToCard();
}

window.onload = () => { 
  fetchComputers();
};
