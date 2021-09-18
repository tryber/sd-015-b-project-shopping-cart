const requestURL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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

function createProductItemElement({ sku, name, image }) {
  // Recebe os parâmetros sku, name & image do JSON da API
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', sku));
  return section;
}

function getSkuFromProductItem(item) {
  // Deve ser chamada quando o JSON da API for carregado, para assim realizar sua conversão
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  // Adiciona evento de click para item no Carrinho
  // Quando o item do carrinho for clickado, o mesmo deve ser removido
  console.log('That\'s working Fine!');
}

function createCartItemElement({ sku, name, salePrice }) {
  // Deve ser chamada, ao se clicar no botão "Adicionar ao Carrinho"
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
    });
    itensContainer.appendChild(criaElemento);
    });
}

async function apiRequest(calledURL) {
  // console.log("CONECTANDO A API DO MERCADO LIVRE...");

  fetch(calledURL) // Requisita URL
  .then((response) => response.json()) // Converte Binário para JSON
  .then((element) => criarElementos(element.results))
  .catch((erro) => console.log(':::ERRO::: >>', erro));
}

window.onload = () => {
  apiRequest(requestURL);
  console.log('PÁGINA CARREGADA!!!');
 };
