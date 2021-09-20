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

//                                                                    ---> ACHO Q PODE DELETAR ESSA FUNÇÃO:
// function getSkuFromProductItem(item) {
//   console.log(item.querySelector('span.item__sku').innerText);
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  return event.path[0].remove();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  console.log(`li é ${li.innerText}`);
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

window.onload = () => { 
  getItems();
};
