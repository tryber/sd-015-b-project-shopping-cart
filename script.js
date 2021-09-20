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
  // coloque seu código aqui
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function buscarInfomacaoAppi(item) {
const url = `https://api.mercadolibre.com/sites/MLB/search?q=$${item}`;
fetch(url)
  .then((resposta) => resposta.json())
  .then((resultado) => { 
   const listaDeItens = resultado.results;
  listaDeItens.forEach((element) => {
    const sectioClassItems = document.querySelector('.items');
    sectioClassItems.appendChild(createProductItemElement(element));
});
  });
}

function buscarInfomacaoAppiPeloId(id) {
  if (id !== undefined) {
  const url = `https://api.mercadolibre.com/items/${id}`;
  fetch(url)
    .then((resposta) => resposta.json())
    .then((resultado) => {
      const ol = document.querySelector('.cart__items');
      const informacaoProduto = resultado;
      ol.appendChild(createCartItemElement(informacaoProduto));
    });
  }
}

function buscarIdQuandoClick() {
  const buttonDeAdicionar = document.querySelector('.items');
  buttonDeAdicionar.addEventListener('click', function buscarId(event) {
    const eventos = event.target;
    if (eventos.className === 'item__add') {
      const sectionInformacaoProduto = event.target.parentElement;
      const spamId = sectionInformacaoProduto.firstChild;
      const valorId = spamId.innerText;
      buscarInfomacaoAppiPeloId(valorId);
    }
  });
} 

window.onload = () => { 
  buscarInfomacaoAppi('computador');
  buscarIdQuandoClick();
  buscarInfomacaoAppiPeloId();
};
