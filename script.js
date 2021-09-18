const ol = document.querySelector('.cart__items');

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

// * Requisito 4.1
const saveStorage = () => {
  localStorage.setItem('item_cart', ol.innerHTML);
};

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

function cartItemClickListener(event) {
  event.target.remove(); // * Requisito 3
  saveStorage(); // * Requisito 4.1
}

// * Requisito 4.2
const loadLocalStorage = () => {
  ol.innerHTML = localStorage.getItem('item_cart');
  ol.childNodes.forEach((li) => {
    li.addEventListener('click', cartItemClickListener);
  });
};

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
      saveStorage(); // * Requisito 4.1
    });
  });
};

window.onload = async () => {
  await createProductList(); // * Requisito 1
  await addProductShoppingCart(); // * Requisito 2
  loadLocalStorage(); // * Requisito 4.2
};
