const ML_API_URL = 'https://api.mercadolibre.com';

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

// Busca o 'sku' de um item
// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Adiciona itens ao carrinho
async function addItemToCart(sku) {
  const requestItem = await fetch(`${ML_API_URL}/items/${sku}`);
  const receivedItem = await requestItem.json();
  const { title, price } = receivedItem;
  const itemObj = {
    sku,
    name: title,
    salePrice: price,
  };
  document.querySelector('.cart__items').appendChild(createCartItemElement(itemObj));
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const addToCartButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  // Cria event listeners para os botões de 'Adicionar ao carrinho!'
  addToCartButton.addEventListener('click', () => {
    addItemToCart(sku);
  });
  section.appendChild(addToCartButton);   
  return section;
}

// Faz requerimento de busca à API
async function requestSearchToML() {
  const product = 'computador';
  const requestProductSearch = await fetch(`${ML_API_URL}/sites/MLB/search?q=${product}`); // envia requerimento à API
  const productList = await requestProductSearch.json(); // faz um parse dos resultados entregues pela API para o formato .json
  const productListResults = productList.results; // cria array com os resultados (especificamente o parâmetro .results) 
  productListResults.forEach((_product) => {
    const sku = _product.id;
    const name = _product.title;
    const image = _product.thumbnail;
    const itemsClass = document.querySelector('.items');
    itemsClass.appendChild(createProductItemElement({ sku, name, image }));
  });
}

window.onload = () => {
  // Envia a requisição à API
  requestSearchToML();
};