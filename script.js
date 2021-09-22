const olCartItems = document.querySelector('.cart__items');
function sumTotalPrice() {
  const listForSum = [...document.querySelectorAll('.cart__item')];
  const textPrice = document.querySelector('.total-price');
  const listNumber = listForSum.map((element) => {
    const valueWord = element.innerText.split('$').reverse()[0];
    return parseFloat(valueWord);
  });
  const priceSum = listNumber.reduce((acumulator, currentValue) => acumulator + currentValue, 0);
  textPrice.innerText = `${priceSum}`;
  // .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function saveList() {
  const saveLi = []; // save list
  const listSave = document.querySelectorAll('li');
  listSave.forEach((element) => {
    saveLi.push(element.innerText);
  });
  localStorage.setItem('listSave', JSON.stringify(saveLi));
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const listItem = event.target;
  listItem.remove();
  sumTotalPrice();
  saveList();
}

const empytItemsCart = document.querySelector('.empty-cart');
empytItemsCart.addEventListener('click', () => {
  const olFather = document.querySelector('.cart__items');
  while (olFather.firstChild) {
    olFather.removeChild(olFather.firstChild);
  }
}); 

const listGet = JSON.parse(localStorage.getItem('listSave'));
function getList() {
  if (listGet) {
    listGet.forEach((element) => {
      const liCartItem = document.createElement('li');
      liCartItem.innerText = element;
      olCartItems.appendChild(liCartItem);
      liCartItem.addEventListener('click', cartItemClickListener);
      saveList();
    });
  }
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  sumTotalPrice();
  saveList();
  return li;
}

/*  const listGetSplit = listGet.map((element) => element.split('|'));
 console.log(listGetSplit);
 textPrice.innerText = 0;
 // console.log(listGet);
 if (listGet) {
   listGetSplit.forEach((element) => {
     textPrice.innerText += element.salePrice;
   });
   saveList();
 } */
// sumTotalPrice();

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}
function selected(sku) {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then((responsive) => responsive.json())
    .then((dados) => {
      createCartItemElement(dados);
      olCartItems.appendChild(createCartItemElement(dados));
      sumTotalPrice();
      saveList();
    }); // capturing objects
}
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const buttonSelect = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  buttonSelect.addEventListener('click', () => selected(sku));
  section.appendChild(buttonSelect); // creating buton 
  return section;
}

function creatObject(dados) {
  const divHtml = document.querySelector('.items'); // capturing div by class items
  dados.forEach((element) => {
    const item = createProductItemElement(element);
    divHtml.appendChild(item);
  });
}

function requestComputer() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then((responsive) => responsive.json())
    .then((dados) => {
      creatObject(dados.results);
      const clear = document.getElementsByTagName('h2');
      clear.remove();
    }); // capturing objects
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

window.onload = () => {
  requestComputer();
  getList();
  sumTotalPrice();
  // requestItemId();
};
