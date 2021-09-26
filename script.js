const URL = 'https://api.mercadolibre.com';

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addItemsCart(sku) {
  const product = await (await fetch(`https://api.mercadolibre.com/items/${sku}`)).json();
  const { title, price } = product;
  const itemObject = {
    sku,
    name: title,
    salePrice: price,
  };
  document.querySelector('.cart__items').appendChild(createCartItemElement(itemObject));
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  // Cria um escutador para o botão 'Adicionar ao carrinho!' para não precisar do forEach
  const addCartButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  addCartButton.addEventListener('click', () => {
    addItemsCart(sku);
  });
  section.appendChild(addCartButton);   

  return section;
}

// Requisição de busca feita na API
async function searchProductToMl() {
  const product = 'computador';
  //  Faz a requisição com o Fetch e ajusta a URL para a busca de produto
  const searchProduct = await fetch(`${URL}/sites/MLB/search?q=${product}`);
  // Parse dos dados do produto para JSON
  const productList = await searchProduct.json();
  const productListResults = productList.results;
  productListResults.forEach((result) => {
    const sku = result.id;
    const name = result.title;
    const image = result.thumbnail;
    const classItems = document.querySelector('.items');
    classItems.appendChild(createProductItemElement({ sku, name, image }));
  });
}

window.onload = () => {
  // Só deixa a requisição à API ser feita após a pagina estar pronta
  searchProductToMl();
 };
