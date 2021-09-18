function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const item = event.target;
  item.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getButtons = (event) => {
  const clickedButton = event.target;
  const section = clickedButton.parentNode;
  const skuId = section.firstChild;
  fetch(`https://api.mercadolibre.com/items/${skuId.innerText}`)
  .then((res) => res.json())
  .then(({ id, title, price }) => {
    const cartItems = {
      sku: id,
      name: title,
      salePrice: price,
    };
    const olCart = document.querySelector('.cart__items');
    olCart.appendChild(createCartItemElement(cartItems));
  });
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', getButtons);
  }
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

window.onload = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
  .then((bin) => bin.json())
  .then((data) => {
      data.results.forEach(({ id, title, thumbnail }) => {
        const objItems = {
          sku: id,
          name: title,
          image: thumbnail,
        };
        const sectionItems = document.querySelector('.items');
        const itemCreate = createProductItemElement(objItems);
        sectionItems.appendChild(itemCreate);
    });
  });
};
