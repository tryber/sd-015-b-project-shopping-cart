const ol = document.querySelector('.cart__items');
const loading = document.querySelector('.loading');

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

const saveLocalStorage = () => {
  localStorage.setItem('item_cart', ol.innerHTML);
};

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
  event.target.remove();
  saveLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const apiProduct = async (ids) => {
  const fetchID = await fetch(`https://api.mercadolibre.com/items/${ids}`);
  const jsonID = await fetchID.json();
  const { id, title, price } = jsonID;
  const cartItem = document.querySelector('.cart__items');
  cartItem.appendChild(createCartItemElement({ sku: id, name: title, salePrice: price }));
  saveLocalStorage();
  };

const buttonCart = () => {
  const buttonItem = document.querySelectorAll('.item__add');    
    buttonItem.forEach((button) => button.addEventListener('click', (event) => {
      apiProduct(event.target.parentElement.firstChild.innerText);
  }));
};

const loadLocalStorage = () => {
  ol.innerHTML = localStorage.getItem('item_cart');
  ol.childNodes.forEach((li) => {
    li.addEventListener('click', cartItemClickListener);
  });
};

const getComputer = async () => {
  const fetchComputer = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  const computer = await fetchComputer.json();
  const result = computer.results;
  loading.remove();
  result.forEach(({ id, title, thumbnail }) => {
    const productElementItem = createProductItemElement({
      sku: id,
      name: title,
      image: thumbnail,
    });
    const items = document.querySelector('.items');
    items.appendChild(productElementItem); 
  });

  buttonCart();
};

function buttontClear() {
  const cartList = document.querySelectorAll('.cart__item');
  cartList.forEach((li) => {
    li.remove();
  });
}

function buttontClearAll() {
  const clearBT = document.querySelector('.empty-cart');
  clearBT.addEventListener('click', buttontClear);
}

window.onload = () => {
  getComputer();
  loadLocalStorage();
  buttontClearAll();
};
