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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {

}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function requestProduct() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  try {
    const items = await response.json();
    items.results.forEach(({ id, thumbnail, title }) => {
      const itensObjects = { sku: id, name: title, image: thumbnail };
      const classItems = document.querySelector('.items');
      const element = createProductItemElement(itensObjects);
      classItems.appendChild(element);
      // cardButton();
      // console.log(itensObjects);
    });
  } catch (error) {
    console.log('Error requestProduct');
  }
}

async function requestCartProduct(idItem) {
  const itemID = getSkuFromProductItem(idItem);
  try {
    const response = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
    const { id, title, price } = await response.json();

    const itensObject = { sku: id, name: title, salePrice: price };
  //  console.log(itensObject);

    const liElement = createCartItemElement(itensObject);
    const olElement = document.querySelector('.cart__items');
    olElement.append(liElement);
  } catch (error) {
    console.log(error);
  }
}
function cardButton() {
  const buttons = document.querySelectorAll('.item__add');
  console.log(buttons);
  buttons.forEach((but) => but.addEventListener('click', () => {
    requestCartProduct(but.parentElement);
  }));
}

const requestsAsincronos = async () => {
  try {
    await requestProduct();
    cardButton();
    await requestCartProduct();
  } catch (error) {
    console.log('Erro na função async');
  }
};

window.onload = () => { 
  requestsAsincronos();
};

// const [...nodeListArray] = nodeList;
// nodeListArray.map
