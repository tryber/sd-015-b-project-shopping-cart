const itemsSection = document.querySelector('.items');
const olCartSection = document.querySelector('.cart__items');

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

function saveItemsInLocalStorage() {
  const itemsHTMLCollection = document.querySelectorAll('.cart__item');
  const items = [...itemsHTMLCollection];
  const cartItemsInLocalStorage = [];
  items.forEach((item) => {
    const itemObj = {
      className: item.className,
      innerText: item.innerText,
    };
    cartItemsInLocalStorage.push(itemObj);
  });
  localStorage.setItem('items', JSON.stringify(cartItemsInLocalStorage));
}

function cartItemClickListener(event) {
  // const itemInnerText = event.path[1].firstChild.innerText;
  // removeItemsInLocalStorage(itemInnerText);
  saveItemsInLocalStorage();
  return event.path[0].remove();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  olCartSection.appendChild(li);
  return li;
}

async function addToCartCallback(e) {
  const itemId = e.path[1].firstChild.innerText;
  console.log(itemId);
  try {
    const response = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
    const itemData = await response.json();
    createCartItemElement(itemData);
    saveItemsInLocalStorage();
  } catch (error) {
    console.log('Erro ao repassar itens para o carrinho!');
  }  
}

function getAddToCartBtnListener() {
  const addBtn = document.getElementsByClassName('item__add');
  const addToCartBtnArray = [...addBtn];
  addToCartBtnArray.forEach((btn) => btn.addEventListener('click', (e) => addToCartCallback(e)));
}

const getItems = async () => {
  try {
    const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
    const computers = await response.json();
    computers.results.forEach(({ id, title, thumbnail }) => {
      const item = { sku: id, name: title, image: thumbnail };
      const createItem = createProductItemElement(item);
  
      itemsSection.appendChild(createItem);
    });
  } catch (error) {
    console.log('Erro ao receber os dados dos Itens');
  }
  getAddToCartBtnListener();
};

function loadLocalStorage() {
  if (localStorage.getItem('items')) {
    const itemsInLocalStorageCart = JSON.parse(localStorage.getItem('items'));
    itemsInLocalStorageCart.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'cart__item';
      li.innerText = item.innerText;
      li.addEventListener('click', cartItemClickListener);
      olCartSection.appendChild(li);
    });
  // return li;
  }
}
window.onload = () => { 
  getItems();
  loadLocalStorage();
};

// window.onload = () => {
//   if (localStorage.getItem('savedTasks') === null) {
  //     localStorage.setItem('savedTasks', JSON.stringify([]));
  //   } else {
    //     const savedTasks = JSON.parse(localStorage.getItem('savedTasks'));
//     for (let i = 0; i < savedTasks.length; i += 1) {
  //       const oldLi = document.createElement('li');
  //       oldLi.innerText = savedTasks[i].innerText;
  //       oldLi.className = savedTasks[i].className;
  //       oldLi.addEventListener('click', addSelectedClass);
  //       oldLi.addEventListener('dblclick', addCompletedClass);
  //       ol.appendChild(oldLi);
  //     }
  //   }
  // };
  
//                                                                              ----> falta a 'appendar' o LI na OL ao iniciar a página
// function createCartItemElement({ id, title, price }) {
  // const li = document.createElement('li');
  // li.className = 'cart__item';
  // li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  // li.addEventListener('click', cartItemClickListener);
  // olCartSection.appendChild(li);
  // return li;
// }

// const localStorageCart = JSON.parse(localStorage.getItem('ObjetoParaGuardar'));
// let ObjetoParaGuardar = localStorage.getItem('ObjetoParaGuardar') ? localStorageCart : [];

// const updateLocalStorageCart = () => {
//   localStorage.getItem('ObjetoParaGuardar', JSON.stringify(ObjetoParaGuardar));
// };

// function removeItemsInLocalStorage(itemInnerText) {
//   if (localStorage.getItem('items') !== null) {
//     const items = JSON.parse(localStorage.getItem('items'));
//     items.forEach((item, i) => {
//       console.log('ITEM É:', item);
//     if (item.innerText === itemInnerText) return localStorage.removeItem(`items[${i}]`);
//     });
//   }
// }
