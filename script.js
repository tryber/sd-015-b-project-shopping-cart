const requestURL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const arrayTeste = [];
localStorage.setItem('arrayCarrinho', JSON.stringify(arrayTeste));

function createProductImageElement(imageSource) {
  // Cria elemento com os dados do createProductItemElement
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  // Cria elemento com os dados do createProductItemElement
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

async function sumItems(param) {
  const totalPrice = document.querySelector('.total-price'); // Verifica o Preço
  const cartItems = document.querySelectorAll('.cart__item');
  const arrayElementos = [...cartItems];
  // console.log(cartItems);
  // console.log(arrayElementos);
  if (arrayElementos.length === 0) {
    totalPrice.innerText = 0;
  }
  const calculaTotal = arrayElementos.reduce((acc, item) => {
    const elementoItem = item.innerText;
    const posicaoElemento = elementoItem.match(/(PRICE: \W)/).index + 8;
    const totalValue = Number(elementoItem.slice(posicaoElemento));
    totalPrice.innerText = acc + totalValue;
    return acc + totalValue;
  }, 0);
  return calculaTotal;
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
  this.remove();
  sumItems();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
function criarElementos(dados) {
  const resultados = dados;
  const itensContainer = document.querySelector('.items');
  resultados.forEach(({ id, title, thumbnail, price }) => {
    const dadosRecebidos = {
      sku: id,
      name: title,
      image: thumbnail,
      salePrice: price,
    };
    const criaElemento = createProductItemElement(dadosRecebidos);
    criaElemento.addEventListener('click', () => {
      const itensCarrinho = document.querySelector('.cart__items');
      const novaLi = createCartItemElement(dadosRecebidos);
      itensCarrinho.appendChild(novaLi);
      sumItems();
    });
    itensContainer.appendChild(criaElemento);
    });
}
function removeLoading() {
  const loadingNode = document.querySelector('.loading');
  loadingNode.remove();
}

async function apiRequest(calledURL) {
  fetch(calledURL)
  .then((response) => response.json())
  .then((element) => {
    criarElementos(element.results);
    removeLoading();
  })
  .catch((erro) => console.log(':::ERRO::: >>', erro));
}

function salvarCarrinho() {
  const listaOrdenada = document.querySelectorAll('li');
  const arrayCarrinho = [];
  listaOrdenada.forEach((elemento) => {
    arrayCarrinho.push(elemento);
  });
  localStorage.setItem('arrayCarrinho', JSON.stringify(arrayCarrinho));
}

function limpaLista() {
  const botaoLimpar = document.querySelector('.empty-cart');
  const moneyValue = document.querySelector('.total-price');
  botaoLimpar.addEventListener('click', function () {
    const listaCompras = document.querySelectorAll('li');
    listaCompras.forEach((produto) => {
      produto.remove();
    });
    moneyValue.innerText = 0;
    sumItems();
  });  
}

window.onload = () => {
  apiRequest(requestURL);
  limpaLista();
  // localStorageLoad();
  console.log('PÁGINA CARREGADA!!!');
 };
