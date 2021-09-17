function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const event = document.createElement(element);
  event.className = className;
  event.innerText = innerText;
  return event;
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

//  utilizei parte dos codigos utilizados na aula 9.2
// https://github.com/tryber/sd-015-b-live-lectures/pull/23
const requestComputers = async () => {
 const computerResults = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
 const computerList = await computerResults.json();
    computerList.results.forEach(({ id, title, thumbnail }) => {
    const productList = document.querySelector('section .items');
    const listProduct = createProductItemElement({ id, title, thumbnail });
    productList.appendChild(listProduct);
    });
    //  Depois de obter o json, pegamos o array results que ele possui event 
    // fazemos um forEach para que cada elemento seja aplicado.Podem passamos como
    // parametro o id, title event thumbnail, lembrando que eles fora "traduzidos" na função
    // creatProductItemElement. trocamos o nome da chave do objeto., depois disso 
    // procuramos onde esse elemento sera criado, semdo filho da section com a classe .item,
    // event adicionamos  esse filho utilizando a função.
};
// requesito 2
// acessado: https://github.com/tryber/sd-014-b-project-shopping-cart/blob/antonio-martins-neto-shopping-cart/script.js
const getIdProductSelected = async (id) => {
  const idResult = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const idJson = await idResult.json();
  return idJson;
};
// Aquí procuramos outras informações por outro endpoint. E retornamos um
// json,

const addToCart = () => {
  const section = document.querySelector('.items');
  // Aquí buscamos os elementos com a classe .items
  section.addEventListener('click', async (event) => {
    //  Aquí add um "escutador" quando damos um click, neses elementos que possue a classe .items, ele gera uma função assincrona;
    if (event.target.className === 'item__add') {
      // Aqui fizemos uma condição se o evento do click "target", possuir a classe .item__add ele continua.
      const cartItens = document.querySelector('.cart__items');
      const itemParent = event.target.parentElement;
      // Aqui buscamos o pai do alvo do click, já que o alvo foi um button precisamos do elemento que ele está inserido, nesse caso o item
      const itemId = getSkuFromProductItem(itemParent);
      // Aqui pegamos esse elemento pai, e jogamos na função para obter seu id:sku,
      const itemDetails = await getIdProductSelected(itemId);
      // Pegmos sku obtido e jogamos na função para obter as informações com o id obtido
      cartItens.appendChild(createCartItemElement(itemDetails));
      // Aqui criamos esse item clicado no carrinho de compras;
    }
  });
};

window.onload = () => { 
  requestComputers();
  addToCart();
};