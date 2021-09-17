const URL_API = 'https://api.mercadolibre.com/sites/MLB';

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
  const response = await fetch(`${URL_API}/search?q=computador`);
  const results = await response.json(); // requisito 01 A lista de produtos que devem ser exibidos é o array results no JSON acima.
  //console.log(results)
  const listComp = await results.results;
  //console.log(listComp)
  for (const key in listComp) { // for in usa a chave do objeto como indice no percorrimento 
    //console.log(listComp[key])
    document.querySelector('.items').appendChild(createProductItemElement(listComp[key]));
  }
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
// as variáveis sku, no código fornecido, se referem aos campos id retornados pela API. o tile e thumbnail eu fiz com a ajuda dos colegas - não testado ainda.
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
  event.remove(); // aqui só tem que remover tudo, limpar.
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = () => { };
// faz o try / catch da API - pra ver se retorna mesmo os computadores 
window.onload = async () => {
  try {
    const computer = await getComputer();
    addProdutsToScreen(computer);
  } catch (e) {
    console.log(e);
  }
};
