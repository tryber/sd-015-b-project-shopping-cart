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
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const createElement = async () => {
  try {
    const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
    const listItems = await response.json();
    return listItems.results.forEach(({ id, title, thumbnail }) => {
      const resultPromisse = {
        sku: id,
        name: title,
        image: thumbnail,
      };
      const classItems = document.querySelector('.items');
      const Element = createProductItemElement(resultPromisse);
      classItems.appendChild(Element);
    });
  } catch (error) {
    return console.error('Deu erro na requisição de computadores');
  }
};

const getId = async (item) => {
  const result = getSkuFromProductItem(item);
  fetch(`https://api.mercadolibre.com/items/${result}`)
  .then((response) => response.json())
  .then(({ id, title, price }) => {
    const object = {
      sku: id,
      name: title,
      salePrice: price,
    };
    const olCart = document.querySelector('.cart__items');
    const liCart = createCartItemElement(object);
    olCart.appendChild(liCart);
  })
  .catch(() => console.error('Deu erro para adicionar ao carrinho'));
};

const buttonAdd = () => {
  const items = document.querySelectorAll('.item');
  items.forEach((item) =>
    item.lastChild.addEventListener('click', () => getId(item)));
};

const orderFunction = () => {
  createElement().then(() => buttonAdd());
};

window.onload = () => {
  orderFunction();
};
