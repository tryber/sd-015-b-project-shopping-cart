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
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!')
  );

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  let target = event.target.innerText;
  let cart = document.getElementsByClassName('cart__item');
  for (let index = 0; index < cart.length; index++) {
    const element = cart[index];
    if (target == element.innerText) {
      IDList.splice(index, 1);
      element.remove();
      createCardItems(IDList);
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

/////////////////////////////////////////////////////////////////////////////////////////////

let IDList = [];

async function fetchPCs() {
  try {
    const res = await fetch(
      'https://api.mercadolibre.com/sites/MLB/search?q=computador'
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
async function setupProductList() {
  const itemList = document.querySelector('.items');

  data = await fetchPCs();
  data.results.forEach((e) => {
    let product = {
      sku: e.id,
      name: e.title,
      image: e.thumbnail,
    };
    const item = createProductItemElement(product);
    itemList.append(item);
  });

  const addButton = document.querySelectorAll('.item__add');
  addButton.forEach((e) => {
    e.addEventListener('click', (e) => {
      createCardProduct(e);
    });
  });
}

function createCardProduct({ target }) {
  const id = target.parentNode.children[0].innerText;
  IDList.push(id);
  createCardItems(IDList);
}

async function getProductFromID(ID) {
  try {
    const res = await fetch(`https://api.mercadolibre.com/items/${ID}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
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
    GetSumOfPrice(IDList);
  });
}

async function GetSumOfPrice(array) {
  let sum = 0;
  console.log('Setting Price');
  array.forEach(async (element) => {
    const data = await getProductFromID(element);
    console.log(data);
    sum += data.price;
    console.log(sum);
    document.querySelector('.total-price').innerHTML = sum;
  });
}

window.onload = () => {
  setupProductList();
  if ('cart' in localStorage) {
    IDList = JSON.parse(localStorage.cart);
    createCardItems(IDList);
  }
};

window.onunload = () => {
  localStorage.cart = JSON.stringify(IDList);
};
