// Créditos: Breno da Cunha - Turma 15; me ajudar a resolver requisito 5.

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
  const span = document.querySelector('.total-price');
  const valorSub = event.target.innerText.split('$')[1];
  const acumulador = span.innerText - Number(valorSub);
  span.innerHTML = acumulador;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function somaTotal(preço) {
  const span = document.querySelector('.total-price');
  const acumulador = preço + Number(span.innerText);
  span.innerText = acumulador;
}

function handleButtonCallback(event) {
  const objeto = event.target.parentNode;
  const id = getSkuFromProductItem(objeto);
  const url = `https://api.mercadolibre.com/items/${id}`;
  fetch(url)
    .then((response) => response.json())
    .then((item) => {
      console.log(item);
      const ol = document.querySelector('.cart__items');
      const { id: sku, title: name, price: salePrice } = item;
      const test = createCartItemElement({ sku, name, salePrice });
      ol.appendChild(test);
      somaTotal(salePrice);
    });
}

function handleButtonId() {
  const buttonId = document.querySelectorAll('.item__add');
  buttonId.forEach((element) => {
    element.addEventListener('click', handleButtonCallback);
  });
}

function getItemsFromAPI() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(url)
    .then((result) => result.json())
    .then((items) => items.results)
    .then((apenda) => apenda.forEach((element) => {
      const item = document.querySelector('.items');
      item.appendChild(createProductItemElement(
        { sku: element.id, name: element.title, image: element.thumbnail },
      ));
    }))
.then(() => handleButtonId())
    .then(() => {
      const loading = document.querySelector('.loading');
      loading.remove();
    });
}

function limpaCarrinho() {
  const botaoDeEsvaziar = document.querySelector('.empty-cart');
  botaoDeEsvaziar.addEventListener('click', () => {
    const li = document.querySelectorAll('.cart__item');
    li.forEach((element) => element.remove());
  });
}

window.onload = () => {
  getItemsFromAPI();
  limpaCarrinho();
};
