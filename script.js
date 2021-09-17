function sumTotal() {
  const cart = document.querySelectorAll('.cart__item');
  const prices = [];
  if (cart.length === 0) document.querySelector('.total-price').innerText = 0;
  cart.forEach((item) => {
    const id = item.querySelector('span').classList[1];
    fetch(`https://api.mercadolibre.com/items/${id}`)
      .then((product) => product.json())
      .then(({ price }) => {
        prices.push(price);
      })
      .then(() => {
        let total = 0;
        for (let index = 0; index < prices.length; index += 1) total += prices[index];
        document.querySelector('.total-price').innerText = total;
      });
  });
}

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const id = event.target.querySelector('span').classList[1];
  const stored = JSON.parse(localStorage.getItem(id));
  if (stored.amount === 1) {
    localStorage.removeItem(id);
  } else if (stored.amount > 1) {
    const storage = JSON.parse(localStorage.getItem(id)).amount;
    localStorage.setItem(id, JSON.stringify({ item: stored.item, amount: storage - 1 }));
  }
  event.target.remove();
  sumTotal();
}

function createSpan(sku) {
  const span = document.createElement('span');
  span.classList.add('sku:', sku);
  return span;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.appendChild(createSpan(sku));
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addToCart() {
  const id = getSkuFromProductItem(this);
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((item) => item.json())
    .then(({ title, price }) => {
      const item = { sku: id, name: title, salePrice: price };
      const cart = document.querySelector('.cart__items');
      const productToCart = createCartItemElement(item);
      cart.appendChild(productToCart);
      sumTotal();
      if (!localStorage.getItem(id)) {
        localStorage.setItem(id, JSON.stringify({ item, amount: 1 }));
      } else {
        const storedAmount = JSON.parse(localStorage.getItem(id)).amount;
        localStorage.setItem(id, JSON.stringify({ item, amount: storedAmount + 1 }));
      }
    });
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

function loadCart() {
  const cartItems = Object.keys(localStorage);
  cartItems.forEach((key) => {
    const stored = JSON.parse(localStorage.getItem(key));
    for (let index = 0; index < stored.amount; index += 1) {
      const cart = document.querySelector('.cart__items');
      const productToCart = createCartItemElement(stored.item);
      cart.appendChild(productToCart);
    }
  });
  sumTotal();
}

window.onload = () => {
  fetchProducts();
  loadCart();
};
