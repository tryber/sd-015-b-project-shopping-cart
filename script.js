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
  section.addEventListener('click', addToCart);
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

function fetchProducts() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((data) => data.json())
    .then((product) => {
      product.results.forEach(({ id, title, thumbnail }) => {
        const item = { sku: id, name: title, image: thumbnail };
        const productList = document.querySelector('section.items');
        const productToList = createProductItemElement(item);
        productList.appendChild(productToList);
      });
    });
}

function addToCart() {
  const id = getSkuFromProductItem(this);
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((product) => product.json())
    .then(({ title, price }) => {
      const item = { sku: id, name: title, salePrice: price};
      const cart = document.querySelector('.cart__items');
      const productToCart = createCartItemElement(item);
      cart.appendChild(productToCart);
    })
}

window.onload = () => {
  fetchProducts();
};
