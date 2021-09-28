const urlApi = ('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
const retrieveCart = localStorage.getItem('cart');

function criarItemProduto(produto, className, innerText) {
  const itemProduto = document.createElement(produto);
  itemProduto.className = className;
  itemProduto.innerText = innerText;
  
  return itemProduto;
}

// Material utilizado para consulta: https://github.com/tryber/sd-015-b-project-shopping-cart/pull/2/commits/429533047ef3f9d1453a241cdd3c95aa6971a521
async function calcularTotalCompra() {
  const todosProdutos = [...document.querySelectorAll('#valorProduto')];
  const totalPrice = document.querySelector('.total-price');

  const valores = todosProdutos.map((item) => {
    const valor = item.innerText.split('$').reverse()[0];
    const valorTratado = parseFloat(valor, 10);

    return valorTratado;
  });

  const sum = valores.reduce((total, current) => (total + current), 0);
  totalPrice.innerText = `${sum}`;

  return totalPrice;
}

function criarItemImagem(img) {
  const imagem = document.createElement('img');
  imagem.className = 'image';
  imagem.src = img;

  return imagem;
}

function pegarElementosProdutos({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(criarItemProduto('span', 'item__sku', sku));
  section.appendChild(criarItemProduto('span', 'item__title', name));
  section.appendChild(criarItemImagem(image));
  section.appendChild(criarItemProduto('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getIdSku(item) {
  return item.querySelector('span.item__sku').innerText;
}

function getProdutos() {
  const itemsCart = [...document.querySelectorAll('.cart__item')];
  const itemLocalStorage = [];

  itemsCart.forEach((item) => {
    itemLocalStorage.push(item.innerHTML);
  });
  
  localStorage.setItem('cart', JSON.stringify(itemLocalStorage));
}

function criarCart(event) {
  // coloque seu código aqui
  event.target.remove();

  calcularTotalCompra();
  getProdutos();
}

function salvarCart() {
  const olCartLista = document.querySelector('.cart__items');
  const listaSalvaCart = JSON.parse(localStorage.getItem('cart'));

  listaSalvaCart.forEach((item) => {
    const li = document.createElement('li');
    li.innerHTML = item;
    li.classList.add('cart__item');
    li.id = 'valorProduto';
    li.addEventListener('click', criarCart);
    
    olCartLista.appendChild(li);
  });
}

function limparCart() {
  const ol = document.createElement('ol');
  const section = document.querySelector('.cart');
  const olCartLista = document.querySelectorAll('.cart__item');

  olCartLista.forEach((removerCart) => {
    removerCart.remove();
  });
  
  ol.classList.add('cart__items');
  section.appendChild(ol);

  calcularTotalCompra();
  getProdutos();
}

function criarElementoCart({ sku, name, salePrice }) {
  const li = document.createElement('li');

  li.className = 'cart__item';
  li.id = 'valorProduto';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  
  li.addEventListener('click', criarCart);

  return li;
}

async function addItem(element) {
  const idProduto = getIdSku(element);
  const itemApi = `https://api.mercadolibre.com/items/${idProduto}`;
  
  return fetch(itemApi)
    .then((response) => response.json())
    .then(({ id, title, price }) => {
      const carList = {
        sku: id, 
        name: title,
        salePrice: price,
      };

      const olCartList = document.querySelector('.cart__items');

      olCartList.append(criarElementoCart(carList));
      calcularTotalCompra();
      getProdutos();
    });
}

function criarEventButton() {
  const section = document.querySelectorAll('.item');
  const loading = document.querySelector('.loading');

  section.forEach((carItem) => carItem.lastChild
    .addEventListener('click', (() => {
      addItem(carItem);
    })));

  loading.remove();
}

async function getUrl(url) {
  return fetch(url)
    .then((getJson) => getJson.json())
    .then((getSearch) => getSearch.results
      .forEach(({ id, title, thumbnail }) => {
        const items = {
          sku: id,
          name: title,
          image: thumbnail,
        };
      const selecionaItem = document.querySelector('.items');
      const criaItem = pegarElementosProdutos(items);
      selecionaItem.append(criaItem);
    }));
}

window.onload = () => { 
  getUrl(urlApi)
    .then(() => criarEventButton());

    const botao = document.querySelector('.empty-cart');
    botao.addEventListener('click', limparCart);

    if (retrieveCart) salvarCart();

    calcularTotalCompra();
};
