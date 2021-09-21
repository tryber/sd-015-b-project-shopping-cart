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

const apiProduct = async (ids) => {
  const fetchId = await fetch(`https://api.mercadolibre.com/items/${ids}`);
  const jsonId = await fetchId.json();
  const { id, title, price } = jsonId;
  const cartItem = document.querySelector('.cart_items');
  cartItem.appendChild(createCartItemElement({ sku: id, name: title, saleprice: price }));
};

const buttonCart = () => {
  const buttonItem = document.querySelectorAll('.item_add');
  buttonItem.forEach((button) => button.addEventListener('click', (event) => {
    apiProduct(event.target.parentElement.firstChild.innerText);
  }));
};

const getComputer = async () => {
  const fetchComputer = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  const computer = await fetchComputer.json();
  const result = computer.results;
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

window.onload = () => {
  getComputer();
};
