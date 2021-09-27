const container = document.querySelector('.container');
const loading = document.querySelector('.loading');

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
  
  return section;
}

const addApiMercadoLivre = async () => {
  const endPoint = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const endPointJson = await endPoint.json();
  // console.log(endPointJson); 
  endPointJson.results.forEach(({ id, title, thumbnail }) => {
    const productElementItem = createProductItemElement({ 
      sku: id,
      name: title,
      image: thumbnail,
    });

  const addSection = document.querySelector('.items');
  addSection.appendChild(productElementItem);
  });
};

// Essa função, eu usei para adicionar a API em formato de json, e para chamar a função "createProductItemElement" mexendo já nos objetos, atribuindo o valor do sku, name, e image.

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

let acumulador = 0;
const calculator = (price, operador) => {
  const paragrafo = document.querySelector('.total-price');
  if (operador === 'soma') {
     acumulador += price; 
    }
  if (operador === 'subtracao') {
    acumulador -= price;
  }
  paragrafo.innerHTML = `${(acumulador)}`;
};

// parseFloat((acumulador).toFixed(2))
// aqui eu fiz os caluculos dos preços sempre que vão adicionando no carrinho. Usei a função parseFloat, porque eu consigo pegar uma string e converter ela para Number, sendo números flutuantes.

function cartItemClickListener(event, price) {
  const removeList = event.target;
  removeList.parentElement.removeChild(removeList);
  calculator(price, 'subtracao');
}

// aqui usei target para atingir o alvo do parâmetro, e removi os filhos da ol.

const ol = document.querySelector('.cart__items');
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  console.log(name);
  li.className = `cart__item ${sku}`;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => cartItemClickListener(event, salePrice));
  ol.appendChild(li);
  return li;
}

const API = async (pesquisa) => {
  const api = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${pesquisa}`);
  const apiJson = await api.json();
  return apiJson.results;
};

  // Nessa função eu peguei a API do mercado livre, passei para json, e já traduzido para json  acessei o results com o, para chamar ela na outra função, na addCarrinho

  const saveStorange = () => {
    const itemsToSend = [];
    ol.forEach((elemento) => {
      itemsToSend.push(elemento.innerHTML);
    });
    localStorage.setItem('itensCarrinho', JSON.stringify(itemsToSend));
  };  

// fiz um localStorange para salvar meus itens

const buttonCart = () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((classItemAdd) => {
    classItemAdd.addEventListener('click', (event) => {
      const noPai = event.target.parentNode;
      const buttonId = noPai.firstChild.innerText;
      // console.log(buttonId);
      fetch(`https://api.mercadolibre.com/items/${buttonId}`)
      .then((element) => element.json())
      .then((result) => {
        const { id, title, price } = result;
        createCartItemElement({ id, title, price });
        calculator(price, 'soma');
      });
  });
});
};

// Nessa função, eu busquei pela classe "item__add" que é a classe do botão, a apartir dele eu percorro por todas as classes "item__add". E então com esse forEach eu uso o addEventListener para quando eu clicar: fiz uma logica para isso => que foi atingir o alvo do nó Pai das classes. Dpois, a partir do nó Pai, vou para o texto do html do primeiro nó Filho. Fiz tudo isso para adicionar a API de qualquer Id que eu clicar, qualquer item q eu clicar eu adiciono na lista, pois coloquei a constante "buttonId". E a partir daí, usei o then primeiro para traduzir a API para json, e dps usei para utiliar os objetos dos parâmetros da função "createCartItemElement".

const addCarrinho = async () => {
  const requisicao = API('MLB1341706310');
  const done = await requisicao;
  
  done.forEach((product) => {
    const { title: name, id, thumbnail: image } = product;
    createProductItemElement({ id, name, image });
  });
  buttonCart();
};

// Essa função, eu usei para atribuir o parametro da função "API", depois peguei essa API e percorri ela com o forEach, para montar o objeto conforme a funçao "createProductItemElement". E por ultimo usei para chamar a função "buttonCart".

const butao = document.querySelector('.empty-cart');

const removeOl = () => {
  const listaOl = document.querySelector('.cart__items');
    listaOl.innerHTML = '';
};

butao.addEventListener('click', removeOl);

// aqui eu apenas criei uma função, que utiliza o botao com a classe "empty-cart" que ativa a função "removeOl", e dentro dessa função eu troco o innerHTML por uma string vazia, sempre que clicar no botao de limpar.

window.onload = () => {
  addApiMercadoLivre();
  addCarrinho();
};
