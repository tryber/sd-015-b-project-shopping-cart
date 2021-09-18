const cartSection = document.querySelector('ol'); // * Requisito 4
const priceSave = document.querySelector('.total-price'); // * Requisito 5

// * Requisito 4.1
const localSave = () => {
  localStorage.setItem('chave', cartSection.innerHTML);
  localStorage.setItem('priceKey', priceSave.innerText); // * Requisito 5
};

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

function createProductItemElement({ sku, name, image }) { // * Requisito 1
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) { // * Requisito 2
  return item.querySelector('span.item__sku').innerText;
}

// Requisito 5
const updatePrice = (total) => {
  priceSave.innerText = total;
};

// Requisito 5.1
const addPrice = (price) => {
  let totalPrice = priceSave.innerText;
  totalPrice = Math.round((Number(totalPrice) * 100) + (price * 100)) / 100;
  updatePrice(totalPrice);
};

function cartItemClickListener(event) {
  const cartItem = event.target;
  cartItem.parentElement.removeChild(cartItem); // * Requisito 3
  localSave(); // * Requisito 4.1
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) { // * Requisito 2
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// * ----- Requisito 1 -----
const createProductList = async () => {
  const responseFetch = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const responseJson = await responseFetch.json();
  responseJson.results.forEach((element) => {
    const { id, title, thumbnail } = element;
    const item = createProductItemElement({ sku: id, name: title, image: thumbnail });
    const itemsList = document.querySelector('.items');
    itemsList.appendChild(item);
  });
};

// * ----- Requisito 2 -----
const addProductShoppingCart = async () => {
  const button = document.querySelectorAll('.item__add');
  button.forEach((element) => {
    element.addEventListener('click', async (event) => {
      const itemID = getSkuFromProductItem(event.target.parentElement); // ref.: https://stackoverflow.com/questions/29168719/can-you-target-an-elements-parent-element-using-event-target
      const responseFetch = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
      const responseJson = await responseFetch.json();
      const liProducts = createCartItemElement(responseJson);
      const cartItems = document.querySelector('.cart__items');
      cartItems.appendChild(liProducts);
      localSave(); // * Requisito 4.1
      addPrice(responseJson); // * Requisito 5.1
    });
  });
};

// * Requisito 4.2
const getLocal = () => {
  cartSection.innerHTML = localStorage.getItem('chave');
  const cartItem2 = document.querySelectorAll('.cart__item');
  cartItem2.forEach((element) => {
    element.addEventListener('click', cartItemClickListener);
  });
  priceSave.innerHTML = localStorage.getItem('priceKey'); // * Requisito 5
};

window.onload = async () => {
  await createProductList(); // * Requisito 1
  await addProductShoppingCart(); // * Requisito 2
  getLocal(); // * Requisito 4.2
};
