function calculaValor(preco, operacao) {
  // transforma preco(string) em number
  const preco2 = Number(preco);

  let total = Number(document.getElementsByClassName('total-price')[0].innerText);
  if (operacao === 'soma') { 
    total += preco2;
  }
  if (operacao === 'sub') {
    total -= preco2;
  }
  if (operacao === 'apaga') {
    total = 0;
  }
  localStorage.setItem('price', total);
  document.querySelector('.total-price').innerText = total;
}

function cartItemClickListener(event) {
  const elemento = event.target;
  const preco = elemento.innerText.split('$').pop();
  elemento.remove();
  calculaValor(preco, 'sub');
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
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

function productConsult(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then(({ title, price }) => {
      const object = {
        sku: id,
        name: title,
        salePrice: price,
      };
      const cart = document.getElementsByClassName('cart__items')[0];
      cart.appendChild(createCartItemElement(object));
      calculaValor(price, 'soma');
      localStorage.setItem('listaProdutos', cart.innerHTML);
    });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const butao = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  butao.addEventListener('click', () => { productConsult(sku); });
  section.appendChild(butao);

  return section;
}

 const apiMarket = () => fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then((response) => response.json())
    .then((listItems) => listItems.results.forEach(({ id, title, thumbnail }) => {
      const product = createProductItemElement({ sku: id, name: title, image: thumbnail });
      const items = document.querySelector('.items');
      items.appendChild(product);
}));

function ApagaTudo() {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerText = '';
  calculaValor(0, 'apaga');
}

window.onload = () => { 
  apiMarket().then(() => document.querySelector('.loading').remove());
  const butaoApagar = document.querySelector('.empty-cart');
  butaoApagar.addEventListener('click', ApagaTudo);
  const cart = document.querySelector('.cart__items');
  if (localStorage.getItem('listaProdutos')) {
    cart.innerHTML = localStorage.getItem('listaProdutos');
    document.querySelector('.total-price').innerText = localStorage.getItem('price');
    // transforma html collection em array usando SPREAD para passar no for each
    const produtos = [...cart.children];
    produtos.forEach((produto) => produto.addEventListener('click', cartItemClickListener));
  }
};
