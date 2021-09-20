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

function cartItemClickListener(event) {
  const cartItem = event.target;
  const cart = cartItem.parentElement;
  cart.removeChild(cartItem);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// function getProductId(element) {
//   const sectionItem = element.parentElement;
//   return sectionItem.firstElementChild.innerText;
// }

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function addItemToCart(data) {
  const cartItem = document.querySelector('.cart__items');
  cartItem.appendChild(createCartItemElement(
    { sku: data.id, name: data.title, salePrice: data.price },
  ));
}

async function getProductByIdFromEndpoint(event) {
  const button = event.target;
  const itemId = getSkuFromProductItem(button.parentElement);
  // const itemId = await getProductId(button);

  const response = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const data = await response.json();

  addItemToCart(data);
}

async function handleItemsListButtonEventAdd() {
  const itemsListButtons = document.querySelectorAll('.item__add');
  itemsListButtons.forEach((button) => {
    button.addEventListener('click', getProductByIdFromEndpoint);
  });
}

function handleCartListErasing() {
  const cart = document.querySelector('.cart__items');
  while (cart.firstChild) {
    cart.removeChild(cart.firstChild);
  }
}

async function eraseButtonListener() {
  const eraseButton = document.querySelector('.empty-cart');
  eraseButton.addEventListener('click', handleCartListErasing);
}

async function getProductsFromEndpoint() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const data = await response.json();
  await data.results.forEach((itemOnSale) => {
    const item = document.querySelector('.items');
    item.appendChild(createProductItemElement(
      { sku: itemOnSale.id, name: itemOnSale.title, image: itemOnSale.thumbnail },
    ));
  });
  await handleItemsListButtonEventAdd();
  await eraseButtonListener();
}

// function handleCartListSaving() {
//   const cart = document.querySelectorAll('.cart__item');
//   const itemsSKUs = [];
//   const itemsNames = [];
//   const itemsSalePrices = [];
//   cart.forEach((item) => {
//     const itemsText = item.innerText;
//     const itemsData = itemsText.split('|');
//     const sku = itemsData[0].split(' ')[1];
//     const name = itemsData[1].slice(7, itemsData[1].length - 1);
//     const salePrice = itemsData[2].slice(9);
    
//     itemsSKUs.push(sku);
//     itemsNames.push(name);
//     itemsSalePrices.push(salePrice);
//   });
//   localStorage.setItem('SKUs', JSON.stringify(itemsSKUs));
//   localStorage.setItem('Names', JSON.stringify(itemsNames));
//   localStorage.setItem('SalePrices', JSON.stringify(itemsSalePrices));
// }

// function handleCartListRetrieving() {
//   if (localStorage.length > 0) {
//     handleCartListErasing();
//     const newItemsSKUs = JSON.parse(localStorage.getItem('SKUs'));
//     const newItemsNames = JSON.parse(localStorage.getItem('Names'));
//     const newItemsSalePrices = JSON.parse(localStorage.getItem('SalePrices'));
//     const listSize = newItemsSKUs.length;
//     for (let index = 0; index < listSize; index += 1) {
//       const cartItem = document.querySelector('.cart__items');
//       cartItem.appendChild(createCartItemElement(
//           { sku: newItemsSKUs[index], 
//             name: newItemsNames[index], 
//             salePrice: newItemsSalePrices[index] },
//         ));
//     }
//   } else {
//     return window.onload;
//   }
// }

// function handlePageReload() {
//   window.onreset = 
// }

// function handleAll() {
//   getProductsFromEndpoint();
// }

window.onload = () => { 
  getProductsFromEndpoint();
};
