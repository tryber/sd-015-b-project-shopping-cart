const urlApi = 'https://api.mercadolibre.com/sites/MLB';

// elementos do HTML que não rodam pq o script no index é chamado antes do body.
//const items = document.querySelector('.items');
//
//const totalPrice = document.querySelector('.total-price');


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

async function getComputer() {
  const response = await fetch(`${urlApi}/search?q=computador`);
  const results = await response.json(); // requisito 01 A lista de produtos que devem ser exibidos é o array results no JSON acima.
  //console.log(results) // só pra ver como retorna 
  const listComp = await results.results;
  //console.log(listComp) // retorna lista de objetos 
  for (const key in listComp) { // for in usa a chave do objeto como indice no percorrimento 
    //console.log(listComp[key]) // pra ver como ele separa cada objeto em um elemento, que será percorrido com o indice chave
    document.querySelector('.items').appendChild(createProductItemElement(listComp[key])); // faz o apend qdo a função é executada, fazendo assim a lista de produtos.
  }
  document.querySelector('.loading').remove();
}
/* REQUISITO 2 -  Cada produto na página HTML possui um botão com o nome Adicionar ao carrinho!. Ao clicar nesse botão você deve realizar uma requisição para o endpoint: "https://api.mercadolibre.com/items/$ItemID" onde $ItemID deve ser o valor id do item selecionado.*/
async function addCarrinho(sku){
  const response = await fetch(`https://api.mercadolibre.com/items/${sku}`);
  const results = await response.json(); // pega a resposta da função e transforma em Json.
  // console.log(results) // só pra ver como retorna 
  const name = results.title // pega o title que tem no objeto encontrato pelo ID
  const salePrice = results.price // aqui pega o precço 
  const carrinho = createCartItemElement({ sku, name, salePrice }) // função safada que retorna feião, pq era melhor o nome primeiro. 
  // console.log(carrinho)
  document.querySelector('.cart__items').appendChild(carrinho); // ai 'apenda' o item no carrinho, que é como se adiciona.
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
// as variáveis sku, no código fornecido, se referem aos campos id retornados pela API. o tile e thumbnail eu fiz com a ajuda dos colegas - não testado ainda.
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const botao = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'); // cria o botao
// o botao tem que ter um escutador de evento - que vai receber uma função para poder receber a outra funcao, pq na 1 funcao ele não aceita o parametro, então tem que enganar ele com a arrow. 
// o parametro a ser passado tem que ser SKU.
  botao.addEventListener('click', (() => addCarrinho(sku)));
  section.appendChild(botao);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // console.log(event) //- daqui se ve que retorna o event.target que tem target: <li class="cart__item">
  event.target.remove(); // aqui pega o evento selecionado e remove ele!!!! 
}

function createCartItemElement({ sku, name, salePrice }) {
    const li = document.createElement('li'); 
    li.className = 'cart__item';
    li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
    li.addEventListener('click', cartItemClickListener);

    return li;
}

function apagarTudao(){
  const cart__items = document.querySelector('.cart__items');
  //console.log(cart__items.innerHTML);
  cart__items.innerHTML = ''; // gambiarra que substitui tudo q tá no cart e subistitiu por vazio...
  // innerhtml são os componentes da tag selecionada.
}

window.onload = async () => {
  try { // faz o try / catch da API - pra ver se retorna mesmo os computadores 
    const computer = await getComputer();
  } catch (e) {
    console.log(e);
  }
  const BotaoEmptyCart = document.querySelector('.empty-cart')
  BotaoEmptyCart.addEventListener('click', apagarTudao)
};
