function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const loadTotalPrice = async () => {
  const elementToFill = document.querySelector('.total-price');
  const inTheLocalStorage = await (parseFloat(localStorage.getItem('totalPrice')));
  const totalPrice = await inTheLocalStorage;
  if (Number.isNaN(Number(totalPrice))) {
    elementToFill.innerText = 0;
  } else {
    elementToFill.innerText = totalPrice;
  }
};

const saveCartToLocalStorage = () => {
  const currentCart = document.querySelectorAll('.cart__item');
  const itemsToSend = [];
  currentCart.forEach((item) => {
    itemsToSend.push(item.innerHTML);
  });
  localStorage.setItem('products', JSON.stringify(itemsToSend));
};

const subPrice = async (receivedPrice) => {
  const priceToSubtract = await parseFloat(receivedPrice.innerText.split('$')[1]).toFixed(2);
  const totalInLocal = parseFloat(localStorage.getItem('totalPrice')).toFixed(2);
  const newTotal = totalInLocal - priceToSubtract;
  localStorage.setItem('totalPrice', parseFloat(newTotal).toFixed(2));
  loadTotalPrice();
};

function cartItemClickListener(event) {
  const itemToRemove = event.target;
  subPrice(itemToRemove);
  itemToRemove.parentElement.removeChild(itemToRemove);
  saveCartToLocalStorage();
  loadTotalPrice();
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}  

const addPrice = (receivedPrice) => {
  const oldSum = Number(localStorage.getItem('totalPrice'));
  Number(receivedPrice);
  if (oldSum === undefined) {
    localStorage.setItem('totalPrice', receivedPrice);
  }
  localStorage.setItem('totalPrice', parseFloat(oldSum + receivedPrice).toFixed(2));
};

const requestToAddOnCart = async (itemId) => {
try {
    const response = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
    const selectedComputer = await response.json();
    const sku = selectedComputer.id;
    const name = selectedComputer.title;
    const salePrice = selectedComputer.price;
    const computerToAdd = createCartItemElement({ sku, name, salePrice });
    const listToAddTheComputerOn = document.querySelector('.cart__items');
    listToAddTheComputerOn.appendChild(computerToAdd);
    saveCartToLocalStorage();
    addPrice(salePrice);
    loadTotalPrice();
  } catch (error) {
    console.log(error);
  }  
};

const getProductId = (event) => {
  const selectedProductID = getSkuFromProductItem(event.target.parentElement);
  return (requestToAddOnCart(selectedProductID));
};    

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', (event) => getProductId(event));
  }    
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

const requestProducts = async () => {
  try {
    const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
    const data = await response.json();
    const { results } = data;
    const foundedComputers = results;
    foundedComputers.forEach((computer) => {
      const sku = computer.id;
      const name = computer.title;
      const image = computer.thumbnail;
      const items = document.querySelector('.items');
      const thisComputerElement = createProductItemElement({ sku, name, image });
      items.appendChild(thisComputerElement);
    });    
  } catch (error) {
    console.log(error);
  }
};    

const loadCartFromLocalStorage = () => {
  const cartLoaded = JSON.parse(localStorage.getItem('products'));
  const containerToFill = document.querySelector('.cart__items');
  if (!cartLoaded) {
    return;
  }
  cartLoaded.forEach((item) => {
    const itemToCart = createCustomElement('li', 'cart__item', item);
    itemToCart.addEventListener('click', cartItemClickListener);
    containerToFill.appendChild(itemToCart);
  });
  loadTotalPrice();
};

/**
 * Para entender e resolver o requisito 4 eu precisei consultar as requisições para puxar dos colegas:
 * Amanda Fernandes, em https://github.com/tryber/sd-015-b-project-shopping-cart/pull/63/commits/d951498d3ba358eb447c2943510230d9c40c8b36 e 
 *  https://github.com/tryber/sd-015-b-project-shopping-cart/pull/63/commits/5e632329c8ba06d09377a60fa9b2433d4485684b
 * Gabriel Benedicto: https://github.com/tryber/sd-015-b-project-shopping-cart/pull/96/commits/10e164a7de6b10b84a373a59e301ce0e23048e70
 * Daniel Hott: https://github.com/tryber/sd-015-b-project-shopping-cart/pull/87/commits/838e21e46099c7713194fd8f03ff82b3e5ad52c7
 * Antonio Campos: https://github.com/tryber/sd-015-b-project-shopping-cart/pull/28/commits/c354ccbd5b388654e1d1176f81b587c79eb75002
 * É, eu rachei a cuca e os colegas me ajudaram sem saber. Gostaria de ter tirado as dúvidas numa chamada, numa mentoria ou pelo slack.
 * Mas nem tive tempo durante a semana para acessar esses canais. O importante pra mim foi ter conseguido desenvolver uma lógica e uma dinâmica
 * para resolver a questão.
 */

window.onload = () => {
  requestProducts();
  loadCartFromLocalStorage();
  loadTotalPrice();
};
