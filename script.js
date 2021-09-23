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

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const ol = event.path[1];
  ol.removeChild(event.path[0]);
  localStorage.setItem('click', ol.innerHTML);
}

// abaixo requisito 2.5 ja implantado
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// abaixo requisito 2.4 ja implantado
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// a cima codigo  que ja implementado ---------------------------------------------

// abaixo requisito 2.3 
const addNoCarrinho = async (item) => {
  const pegaId = getSkuFromProductItem(item);
  fetch(`https://api.mercadolibre.com/items/${pegaId}`)
    .then((response) => response.json())
    .then(({ id, title, price }) => {
      const dadosId = {
        sku: id,
        name: title,
        salePrice: price,
      };
      const ol = document.querySelector('.cart__items');
      ol.append(createCartItemElement(dadosId));
    });
};

// abairo requisito 2.2
const addBotao = () => {
  const produtos = document.querySelectorAll('.item');
  console.log(produtos);
  produtos.forEach((item) => item.lastChild.addEventListener('click', (() => 
  addNoCarrinho(item))));

  return produtos;
};

// a baixo requisito 1 monitoria carlol e rafael colombo --------------
const buscarProduto = async () => 
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((data) => data.results.forEach(({ id, title, thumbnail }) => {
    const filtroResultadosObj = { sku: id, name: title, image: thumbnail };
    const selecinaItem = document.querySelector('.items');
    const item = createProductItemElement(filtroResultadosObj);
    selecinaItem.append(item);
  }));
  
// a baixo requisito 2.1 inicio - buscaproduto veio para cá e window.onload inicia agora com loadOrden rafael colombo e virginiaVerso.------------------------------
function gerarPedido() { 
  buscarProduto()
    .then(() => addBotao())
    .catch(() => ('Erro, endereço não encontrado'));
}

window.onload = () => {
  gerarPedido();
};