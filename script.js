function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}
// abaixo requisito 2.5 ja implantado
function cartItemClickListener(event) {
  // abaixo requisito 3 ja implantado
  const cartItemOL = document.querySelector('.cart__items');
  cartItemOL.removeChild(event.target);
}

// abaixo requisito 2.4 ja implantado
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
    return li;
}

// a baixo requisito 2.3 ja implementado
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// a baixo requisito 2.2
const buscarApiId = (itemID) => {
  try {
    const apiProdutoId = `https://api.mercadolibre.com/items/${itemID}`;

    return fetch(apiProdutoId)
      .then((response) => response.json())
      .then((object) => {
        const produtoId = object;
        return produtoId;
      });
  } catch (error) {
  console.log('Erro, endereço não encontrado');
}
};

// a baixo requisito 2.1
const buscaritemId = async (event) => {
  const clickElementoPai = event.target.parentNode;
  const idItem = getSkuFromProductItem(clickElementoPai);
  const objectItemID = await buscarApiId(idItem);
  const { id: sku, title: name, price: salePrice } = objectItemID;
  const cartItemList = createCartItemElement({ sku, name, salePrice });
  const cartList = document.querySelector('.cart__items');
  cartList.appendChild(cartItemList);
}; // rafel machado guimaraes como referencia

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', buscaritemId); // if chamada p/ o botao. requisito 2
  }
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

// a baixo requisito 1 monitoria carlol e rafael colombo --------------
const mercadoLivreApi = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

function buscarProduto() {
  try {
    fetch(mercadoLivreApi)
  .then((response) => response.json())
  .then((data) => data.results.forEach(({ id, title, thumbnail }) => {
    const filtroResultadosObj = { 
      sku: id, 
      name: title, 
      image: thumbnail,
    };
    const selecinaItem = document.querySelector('.items');
    const item = createProductItemElement(filtroResultadosObj);
    selecinaItem.append(item);
  }));
} catch (error) {
  console.log('Erro, endereço não encontrado');
}
}

window.onload = () => {
  // gerarPedido();
  buscarProduto();
  };
