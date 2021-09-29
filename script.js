const olCart = document.querySelector('.cart__items');
const somaPreçosLiCart = document.querySelector('.total-price');
let contador = 0;

function addLoading() {
  const sectionContainer = document.querySelector('.container');
  const h1Loading = document.createElement('h1');
  h1Loading.className = 'loading';
  h1Loading.innerText = 'loading...';
  sectionContainer.appendChild(h1Loading);
}

function removeLoading() {
const sectionContainer = document.querySelector('.container');
const h1Loading = document.querySelector('.loading');
sectionContainer.removeChild(h1Loading);
}

function somarPreços() {
  somaPreçosLiCart.innerText = contador;
  }
  
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
  // section.addEventListener('click', getSkuFromProductItem());

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
  olCart.removeChild(event.target);
  const pegarPreço = event.target.innerText.split('$');
  const precoEmNumero = parseFloat(pegarPreço[1]);
  contador -= precoEmNumero;
  // console.log(precoEmNumero);
  somarPreços();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

 function getCartAPI(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`)
 .then((resposta) => resposta.json())
 .then((dados) => {
   const dadosAPI = {
     sku: dados.id,
     name: dados.title,
     salePrice: dados.price,
   };
   const criarLi = createCartItemElement(dadosAPI);
   const ondeVaiLi = document.querySelector('.cart__items');
   ondeVaiLi.appendChild(criarLi);
   contador += dadosAPI.salePrice;
   somarPreços();
});
}

function buttonClick(itemSection) {
  const pegarId = getSkuFromProductItem(itemSection);
  getCartAPI(pegarId);
}

function buttonAddCart() {
  const addToCart = document.querySelectorAll('.item__add');
  addToCart.forEach((eachButton) => {
    const itemAddToCart = eachButton.closest('section');
    eachButton.addEventListener('click', () => {
      buttonClick(itemAddToCart);
    });
    // eachButton.addEventListener('click', function () {
    //   console.log(itemAddToCart);
    });
}

function forInApi(dados) {
  const sectionElement = document.querySelector('.items');
  dados.forEach((element) => {
      const produto = {
        sku: element.id,
        name: element.title,
        image: element.thumbnail,
      };
      sectionElement.appendChild(createProductItemElement(produto));
});
  buttonAddCart();
}

function getAPI() {
  addLoading();
   fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
  .then((resposta) => resposta.json())
  .then((dados) => forInApi(dados.results))
  .then(() => removeLoading());
}

  function emptyClick() {
    olCart.innerHTML = '';
    contador = 0;
    somarPreços();
    // console.log('a');
  }
  
  function emptyCart() {
    const emptyButton = document.querySelector('.empty-cart');
    emptyButton.addEventListener('click', emptyClick);
  }

window.onload = () => {
  emptyCart();
  getAPI();
  // console.log(createCartItemElement({sku: 'MLB1341706310', name: 'Processador Amd Ryzen 5 2600 6 Núcleos 64 Gb', salePrice: '879' }));
};

window.onunload = () => {
};
