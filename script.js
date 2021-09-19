const totalString = '.total-price';
const arrayDeItems = [];

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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );
  return section;
}

const addToLocalStorage = ({ id, title, price }) => {
  arrayDeItems.push({ id, title, price });
};

const adicionaArrayAoLocalStorage = () => {
  localStorage.setItem('cart', JSON.stringify(arrayDeItems));
};

const appendItem = (item) => {
  const cart = document.querySelector('.cart__items');
  cart.appendChild(item);
};

const loadOnLocalStorageTotal = () => {
  const valorTotal = JSON.parse(localStorage.getItem('total'));
  if (valorTotal) {
    const totalHTML = document.querySelector(totalString);
    totalHTML.innerHTML = valorTotal;
  }
};

const somaCompras = ({ price }) => {
  const total = document.querySelector(totalString);
  const soma = parseFloat(total.innerText) + price;
  total.innerHTML = soma;
  localStorage.setItem('total', JSON.stringify(soma));
};

function cartItemClickListener(event) {
  // coloque seu código aqui
  const click = event.target;
  const total = JSON.parse(localStorage.getItem('total'));

  const subtrair = click.getAttribute('preco');

  const result = total - subtrair;

  const valorTotal = document.querySelector(totalString);

  valorTotal.innerHTML = result;

localStorage.setItem('total', JSON.stringify(result));

  click.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;

  li.setAttribute('preco', salePrice);

  // console.log(li);

  li.addEventListener('click', cartItemClickListener);
  return li;
}

const insertItems = (array) => {
  const section = document.querySelector('.items');
  array.forEach((elemento) => {
    const sectionItem = createProductItemElement(elemento);
    section.appendChild(sectionItem);
  });
};

const fetchProducts = async (product) => {
  const response = await fetch(
    `https://api.mercadolibre.com/sites/MLB/search?q=${product}`,
  );
  const { results } = await response.json();
  insertItems(results);
};

async function addToCart(event) {
  const click = event.target;
  const sectionDoProduto = click.parentNode;
  const idDoProduto = sectionDoProduto.querySelector('.item__sku').innerText;
  const response = await fetch(
    `https://api.mercadolibre.com/items/${idDoProduto}`,
  );
  const apiDoProduto = await response.json();
  const cart = document.querySelector('.cart__items');
  const cartItem = createCartItemElement(apiDoProduto);
  cart.appendChild(cartItem);
  addToLocalStorage(apiDoProduto);
  adicionaArrayAoLocalStorage();

  const totalPrice = document.querySelector(totalString);
  if (totalPrice) {
    somaCompras(apiDoProduto);
  }
}
const loadOnLocalStorage = () => {
  const myItems = JSON.parse(localStorage.getItem('cart'));
  if (myItems) {
    myItems.forEach((item) => {
      const product = createCartItemElement(item);
      appendItem(product);
    });
  }
};

window.onload = () => {
  fetchProducts('computador').then(() => {
    const botoes = document.querySelectorAll('.item__add');
    botoes.forEach((botao) => botao.addEventListener('click', addToCart));
  });
  loadOnLocalStorage();
  loadOnLocalStorageTotal();
};
