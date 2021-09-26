const URL = 'https://api.mercadolibre.com';
const totalPriceClass = document.querySelector('.total-price');
const buttonRemoveAll = document.querySelector('.empty-cart');

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
// Ajusta o preço do carrinho
function adjustSalePrice(salesPrice, flag) {
  const salePrice = parseFloat(salesPrice);
  let totalPriceFloat = parseFloat(totalPriceClass.innerText);
  // Subtrai o valor do item no valor total do carrinho
  if (flag === '100') {
    totalPriceFloat -= salePrice;
    totalPriceClass.innerText = `${totalPriceFloat}`;
  }
  // Adiciona o valor do item no valor total do carrinho
  if (flag === '101') {
      totalPriceFloat += salePrice;
      totalPriceClass.innerText = `${totalPriceFloat}`;
  }
}

// Remove itens do carrinho
function cartItemClickListener(event, salePrice, flag) {
  if (!event) {
    
  }
  event.target.remove();
  return adjustSalePrice(salePrice, flag);
}

// Cria o carrinho
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // Escuta o click no carrinho
  li.addEventListener('click', (event) => 
  // Passa o valor e a flag 100 para subtrair do valor total 
  cartItemClickListener(event, salePrice, '100'));
  return li;
}

// Adiciona itens ao carrinho
async function addItemsCart(sku) {
  //  Faz a requisição com o Fetch e ajusta a URL para a busca de produto
  // Parse dos dados do produto para JSON
  const product = await (await fetch(`https://api.mercadolibre.com/items/${sku}`)).json();
  const { title, price } = product;
  const itemObject = {
    sku,
    name: title,
    salePrice: price,
  };
  document.querySelector('.cart__items')
  .appendChild(createCartItemElement(itemObject));
  // Ao adicionar um item ao carrinho passa o preço do item e a flag 101 de soma
  adjustSalePrice(price, '101');
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

// Requisição de busca dos produtos feita na API
async function searchProductToMl() {
  const product = 'computador';
  //  Faz a requisição com o Fetch e ajusta a URL para a busca de produto
  // Parse dos dados do produto para JSON
  const searchProductJson = await (await fetch(`${URL}/sites/MLB/search?q=${product}`)).json();
  const productListResults = searchProductJson.results;
  productListResults.forEach(({ id, title, thumbnail }) => {
    const itemObject = {
      sku: id,
      name: title,
      image: thumbnail,
    };
    document.querySelector('.items')
    .appendChild(createProductItemElement(itemObject));
  });
}

function removeAllItemsToCart() {
  document.querySelectorAll('.cart__items').forEach((produto) => produto.remove());
}
buttonRemoveAll.addEventListener('click', removeAllItemsToCart);
window.onload = () => {
  // Só deixa a requisição à API ser feita após a pagina estar pronta
  searchProductToMl();
 };
