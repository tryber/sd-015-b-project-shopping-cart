const fetchML = async (url) => (await fetch(url)).json(); // função genérica do fetch para usar quando necessário

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCart = async (event) => { // ao clicar no botão do carrinho executa as funções abaixo
  const targetID = event.target.parentElement; // seleciona o elemento pai do botão para poder fazer as manipulações
  const productItem = getSkuFromProductItem(targetID); // usa a função já pré estabelicida do projeto para pegar o ID
  // console.log(productItem);
  try { 
    const API_ID_ITEM = `https://api.mercadolibre.com/items/${productItem}`; // url para fazer a fetch de determinado ID
    const { id: sku, title: name, price: salePrice } = await fetchML(API_ID_ITEM); // desestruração de objeto usando uma função fetch ja definida
    // console.log(fetchID);
  const cartItems = document.querySelector('.cart__items'); // pegando a seção cart__items para poder manipulá-la

  cartItems.append(createCartItemElement({ sku, name, salePrice })); // criando o elemento do carrinho e já o colocando no cartItems
  } catch (e) { console.log(e); }   
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (className === 'item__add') e.addEventListener('click', addToCart);
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
const API_URL_MLCOMPUTER = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';



async function requestMLComputer(url) {
  try {
      const fetchingMLComputer = await fetchML(url);
      fetchingMLComputer.results  
      .map(({ id, title, thumbnail }) => {
          const objt = { id, title, thumbnail };
          const sectionItems = document.querySelector('.items'); // pegando o items pra poder jogar o objt como filho dele.
          const eachComputer = createProductItemElement(objt); // usando a função previamente criada para fazer um produto.
          return sectionItems.append(eachComputer); // colocando cada produto criado na seção de items.
        });
  } catch (error) {
    console.log(error);
  }
}

window.onload = () => {
  requestMLComputer(API_URL_MLCOMPUTER);
};
