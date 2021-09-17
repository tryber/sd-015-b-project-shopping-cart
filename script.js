// func 1 - cria uma "img", insere uma classe "item__image" e atribui um src para buscar a imagem
// imageSource -> link da imagem
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// func 2 - cria um elemento com base no primeiro parâmetro, insere uma classe baseado no segundo parâmetro e insere um texto baseado no terceiro parâmetro
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// func 3 - Cria uma "section" no html, e insere uma classe chamada "item", depois criam elementos baseados na função "createCustomElement"
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// func 4 - retorna o sku do item dado por parâmetro
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

function getItemsList() {
  const itemList = document.querySelector('.items');
  return fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((data) => data.results)
  .then((itens) => itens.forEach((item) => {
    itemList.appendChild(createProductItemElement(
      { sku: item.id, name: item.title, image: item.thumbnail },
));
  }));
}

window.onload = () => { 
  getItemsList();
};
