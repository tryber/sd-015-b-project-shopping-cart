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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

let valorTotal = 0;
const spamValor = document.querySelector('.total-price');

function valorTotalDaCompra(valor) {
  const preco = Number(valor);
  valorTotal += preco;
  spamValor.innerText = valorTotal;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const eventos = event.target;
  const valor = eventos.innerText.split('$')[1];
  valorTotal -= Number(valor);
  spamValor.innerText = valorTotal;
  if (eventos.className === 'cart__item') {
    eventos.remove();
  }
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  const informacoesProduto = li.innerText;
  const valorProduto = informacoesProduto.split('$')[1];
  valorTotalDaCompra(valorProduto);
  return li;
}

function buscarInfomacaoAppi(item) {
const loading = document.querySelector('.loading');
const url = `https://api.mercadolibre.com/sites/MLB/search?q=$${item}`;
fetch(url)
  .then((resposta) => resposta.json())
  .then((resultado) => { 
    loading.remove();
   const listaDeItens = resultado.results;
  listaDeItens.forEach((element) => {
    const sectioClassItems = document.querySelector('.items');
    sectioClassItems.appendChild(createProductItemElement(element));
});
  });
}

function buscarInfomacaoAppiPeloId(id) {
  if (id !== undefined) {
  const url = `https://api.mercadolibre.com/items/${id}`;
  fetch(url)
    .then((resposta) => resposta.json())
    .then((resultado) => {
      const ol = document.querySelector('.cart__items');
      const informacaoProduto = resultado;
      ol.appendChild(createCartItemElement(informacaoProduto));
    });
  }
}

// Função que vai retornar o id do produto clicando no butão adicionar  ao carrinho;
function buscarIdQuandoClick() {
  const sectionItems = document.querySelector('.items');
  sectionItems.addEventListener('click', function buscarId(event) {
    const eventos = event.target;
    if (eventos.className === 'item__add') {
      const sectionInformacaoProduto = event.target.parentElement;
      const spamId = sectionInformacaoProduto.firstChild;
      const valorId = spamId.innerText;
      buscarInfomacaoAppiPeloId(valorId);
    }
  });
} 

// Função que vai deletar todos os items do carrinho de compra
function deletarTodosProdutosCarrinho() {
  const buttonEsvariarCarrinho = document.querySelector('.empty-cart');
  buttonEsvariarCarrinho.addEventListener('click', function buscarInformacao() {
    const ol = document.querySelector('.cart__items');
    const listaLi = ol.childNodes;
    for (let index = 0; index < listaLi.length; index += 1 * 0) {
      if (listaLi[index].className === 'cart__item') {
        listaLi[index].remove();
      }
    }
  });
}

window.onload = () => { 
  buscarInfomacaoAppi('computador');
  buscarIdQuandoClick();
  buscarInfomacaoAppiPeloId();
  deletarTodosProdutosCarrinho();
};
