const productsIds = [];

function readList() {
  return document.querySelector('.cart__items');
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

function createProductItemElement(sku, name, image) {
  const sectionOfItems = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  
  return sectionOfItems.appendChild(section);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

let priceItems = 0;

function calc() {
  productsIds.forEach(async (id) => {
    try {
      const getProduct = await fetch(`https://api.mercadolibre.com/items/${id}`);
      const convert = await getProduct.json();

      priceItems += convert.price;
    } catch (error) {
      console.log(error);
    }
  });
}

async function showTotalPrice() {
  const recoverPrice = document.querySelector('.total-price');
  const recoverArea = document.querySelector('.cart');
  const priceP = document.createElement('p');

  if (recoverPrice != null) {
    recoverPrice.remove();
  }

  calc();

  priceP.className = 'total-price';
  priceP.innerText = `${priceItems}`;

  recoverArea.appendChild(priceP);
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
  showTotalPrice();
}

function saveOnStorage() {
  const getItemList = readList();
  const saveList = getItemList.innerHTML;

  return localStorage.setItem('actualCart', saveList);
}

function recoverOfStorage() {
  const recoverList = localStorage.getItem('actualCart');
  const getItemList = readList();
  
  getItemList.innerHTML = recoverList;

  const items = getItemList.querySelectorAll('li');

  items.forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
}

function createCartItemElement(sku, name, salePrice) {
  const cartList = readList();
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return cartList.appendChild(li);
}

async function getInfo(productID) {
  try {
    const getID = getSkuFromProductItem(productID);

    const binaryRes = await fetch(`https://api.mercadolibre.com/items/${getID}`);
    const transformJSON = await binaryRes.json();
    const { id, title, price } = await transformJSON;
    
    createCartItemElement(id, title, price);
    showTotalPrice();
  } catch (error) {
    console.log(error);
  }
}

function addToCart() {
  const cartButton = document.querySelectorAll('.item__add');

  cartButton.forEach((button) => {
    button.addEventListener('click', async (originEvent) => {
      const recoverID = originEvent.target.parentElement;
      await getInfo(recoverID);
      saveOnStorage();
    });
  });
}

async function trackMercadoItems() {
  try {
    const load = document.querySelector('.loading');
    const binaryRes = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
    const responseJSON = await binaryRes.json();
    const resultOfItems = await responseJSON.results;

    await resultOfItems.forEach((product) => {
      const { id, title, thumbnail } = product;
      createProductItemElement(id, title, thumbnail);
      productsIds.push(id);
    });

    load.remove();

    addToCart();
  } catch (error) {
    console.log(error);
  }
}

function cleanCart() {
  const btn = document.querySelector('.empty-cart');
  
  btn.addEventListener('click', () => {
    const getItemList = readList();

    getItemList.innerHTML = '';
    priceItems = 0;
    localStorage.clear();
  });
}

window.onload = () => {
  recoverOfStorage();
  trackMercadoItems();
  cleanCart();
};
