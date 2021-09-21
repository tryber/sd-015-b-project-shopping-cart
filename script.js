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
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}

/// //////////////////////////////////////////////////////////////////////////////////////////

let IDList = [];

async function getProductFromID(ID) {
  try {
    const res = await fetch(`https://api.mercadolibre.com/items/${ID}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

async function GetSumOfPrice(array) {
  const prices = await array.reduce(async (acc, element) => {
    const data = await getProductFromID(element);
    return (await acc) + (await data.price);
  }, 0);
  document.querySelector('.total-price').innerText = prices;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const target = event.target.innerText;
  const cart = document.getElementsByClassName('cart__item');
  for (let index = 0; index < cart.length; index += 1) {
    const element = cart[index];
    if (target === element.innerText) {
      IDList.splice(index, 1);
      element.remove();
      GetSumOfPrice(IDList);
      localStorage.cart = JSON.stringify(IDList);
    }
  }
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createCardItems(array) {
  const card = document.querySelector('.cart__items');
  card.innerHTML = '';
  array.forEach(async (element) => {
    const data = await getProductFromID(element);
    const product = {
      sku: data.id,
      name: data.title,
      salePrice: data.price,
    };
    card.append(createCartItemElement(product));
  });
  GetSumOfPrice(IDList);
}

function createCardProduct({ target }) {
  const id = target.parentNode.children[0].innerText;
  IDList.push(id);
  localStorage.cart = JSON.stringify(IDList);
  createCardItems(IDList);
}

async function fetchPCs() {
  try {
    const res = await fetch(
      'https://api.mercadolibre.com/sites/MLB/search?q=computador',
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
async function setupProductList() {
  const itemList = document.querySelector('.items');

  const data = await fetchPCs();
  data.results.forEach((e) => {
    const product = {
      sku: e.id,
      name: e.title,
      image: e.thumbnail,
    };
    const item = createProductItemElement(product);
    itemList.append(item);
  });
  const addButton = document.querySelectorAll('.item__add');
  addButton.forEach((e) => {
    e.addEventListener('click', (element) => {
      createCardProduct(element);
    });
  });
}

window.onload = () => {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    IDList = [];
    createCardItems(IDList);
  });
  setupProductList();
  if ('cart' in localStorage) {
    IDList = JSON.parse(localStorage.cart);
    createCardItems(IDList);
  }
};
