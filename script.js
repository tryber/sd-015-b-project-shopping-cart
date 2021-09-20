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

function cartItemClickListener(event) {
  const evento = event.target;
  const cart = document.querySelector('.cart__items');
  cart.removeChild(evento);
  localStorage.removeItem('carrinho', evento);
}

function adicionaLocal() {
  const secao = document.getElementById('cart__item').innerHTML;
  localStorage.setItem('carrinho', secao);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  const cart = document.querySelector('.cart__items');
  cart.appendChild(li);
  adicionaLocal();
  return li;
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

function action(event) {
  const id = getSkuFromProductItem(event.target.parentNode);
  console.log(id);
  const url = `https://api.mercadolibre.com/items/${id}`;
  fetch(url)
  .then((element) => element.json())
  .then((data) => createCartItemElement({ sku: data.id, name: data.title, salePrice: data.price }));
}

function pegaBotao(p) {
  p.forEach((element) => {
    element.addEventListener('click', action);
  });
}

function criaItens() {
 const computer = fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computer');
 computer.then((element) => element.json())
 .then((element) => element.results)
 .then((element) => element.forEach((x) => {
 const retorno = { sku: x.id, name: x.title, image: x.thumbnail };
 const item = document.querySelector('.items'); 
 item.appendChild(createProductItemElement(retorno));
 const botoes = document.querySelectorAll('.item__add');
 pegaBotao(botoes);
}));
}

function puxandoDados() {
  const novo = document.getElementById('cart__item');
  if (localStorage.carrinho !== undefined) {
  novo.innerHTML = localStorage.carrinho;
  }
}

function removeLocal() {
  const lis = document.querySelectorAll('.cart__item');
  lis.forEach((element) => {
    element.addEventListener('click', cartItemClickListener);
  });
}

function limparTudo() {
  const botaoLimpar = document.querySelector('.empty-cart');
  botaoLimpar.addEventListener('click', function () {
    const carrinho = document.getElementById('cart__item');
    carrinho.innerHTML = '';
  });
}

window.onload = () => {
  criaItens();
  puxandoDados();
  removeLocal();
  limparTudo();
};