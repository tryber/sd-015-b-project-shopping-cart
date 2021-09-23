function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// executa quando adiciona produto ao carrinho
function cartItemClickListener(event) {
  console.log('clicou');
  // endpoint: "https://api.mercadolibre.com/items/$ItemID"
  // onde $ItemID deve ser o valor id do item selecionado
}

// cria lista de compras no carrinho
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addCartItem(event) {
  const ItemID = getSkuFromProductItem(event.target.parentElement);
  fetch(`https://api.mercadolibre.com/items/${ItemID}`)
  .then((response) => response.json())
  .then((obj) => {
    const cart = document.querySelector('.cart__items');
    const selectedProduct = createCartItemElement(obj);
    return cart.appendChild(selectedProduct);
  });
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  
  const botao = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  botao.addEventListener('click', addCartItem);
  section.appendChild(botao);
  
  return section;
}

function createObjectProduct(dados) {
  const divHtml = document.querySelector('.items');
  const getDados = dados.forEach((dado) => {
    const item = createProductItemElement(dado);
    divHtml.appendChild(item);
  });
  return getDados;
}

function getAPI() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
  .then((response) => response.json())
  .then((obj) => createObjectProduct(obj.results));  
}

window.onload = () => { 
  getAPI();
};
