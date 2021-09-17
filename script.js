const apiProducts = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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

async function fetchApiItems() {
  try {
    const result = await fetch(apiProducts);
    const data = await result.json();
    return data.results.forEach(({ id, title, thumbnail }) => {
      const itemElement = {
        sku: id,
        name: title,
        image: thumbnail,
      };
      const itemsClass = document.querySelector('.items');
      const itemElementToAppend = createProductItemElement(itemElement);
      itemsClass.appendChild(itemElementToAppend);
    });
  } catch (e) {
    return console.error('Não foi possível carregar os items da página');
  }
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const targetedLi = event.target;
  const liParent = targetedLi.parentNode;
  liParent.removeChild(targetedLi);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addToCart(event) {
  const sectionSelected = event.target.parentNode;
  const idToApi = sectionSelected.firstChild.innerText;
  const apiWithId = `https://api.mercadolibre.com/items/${idToApi}`;
  return fetch(apiWithId)
    .then((result) => result.json())
    .then(({ id, title, price }) => {
      const itemAdd = {
        sku: id,
        name: title,
        salePrice: price,
      };
      const cartItems = document.querySelector('.cart__items');
      const liToAdd = createCartItemElement(itemAdd);
      cartItems.appendChild(liToAdd);
    });
}

window.onload = () => { 
  fetchApiItems()
  .then(() => { 
    const itemAddButton = document.querySelectorAll('.item__add');
    itemAddButton.forEach((btn) => btn.addEventListener('click', addToCart));
  });
 };
