function saveLocalStorage() {
    const newArray = [];
    const allCart = [...document.querySelectorAll('.cart__item')];
    allCart.forEach((element) => {
      newArray.push(element.innerHTML);
      localStorage.setItem('savedLocalStorage', JSON.stringify(newArray));
    });
    return localStorage.getItem('savedLocalStorage');
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
  saveLocalStorage();
}

const URL_API = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCartItemElement({ id, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addItemsCart(element) {
  const getItemForId = await fetch(`https://api.mercadolibre.com/items/${element}`);
  const resultId = await getItemForId.json();
  const createCartItem = createCartItemElement({ id: resultId.id,
    name: resultId.title,
    salePrice: resultId.price });
    const olCart = document.getElementsByClassName('cart__items');
    olCart[0].appendChild(createCartItem);
    saveLocalStorage();
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ id, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const btn = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  btn.addEventListener('click', (() => addItemsCart(id)));
  section.appendChild(btn);

  return section;
}

async function requestAPIComputer() {
  const fetchAPI = await fetch(URL_API);
  const result = await fetchAPI.json();
  return result;
}

function addProduct(product) {
  const section = document.querySelector('.items');
  const productOne = product.results.forEach(({ id, title, thumbnail }) => {
    const createElement = createProductItemElement({ id, name: title, image: thumbnail });
    section.appendChild(createElement);
  });
}
function clearAll() {
  const emptyBtn = document.querySelector('.empty-cart');
  const ol = document.querySelectorAll('.cart__items');
  emptyBtn.addEventListener('click', () => {
    ol[0].innerHTML = '';
  });
  saveLocalStorage();
}

function initCart() {
  if (localStorage.getItem('savedLocalStorage')) {
    const cartItemSaved = JSON.parse(localStorage.getItem('savedLocalStorage'));
    console.log(cartItemSaved);
    cartItemSaved.forEach((evento) => {
      const ol = document.querySelector('.cart__items');
      const li = document.createElement('li');
      li.classList.add('cart_item');
      ol.appendChild(li);
      li.innerHTML = evento;
      li.addEventListener('click', cartItemClickListener);
    });
  }
}

function finalPrice() {
  
}
window.onload = async () => { 
  try {
    const product = await requestAPIComputer();
    addProduct(product);
    clearAll();
    initCart();
    finalPrice();
  } catch (error) {
    console.log(error);
  }
};
