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
  const item = document.querySelector('.items');
  const append = item.appendChild(section);

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return append;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const liRemove = event.target;
  liRemove.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  const ol = document.querySelector('.cart__items');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  ol.appendChild(li);

  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getAPI() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((dados) => {
    dados.results.forEach((elemento) => {
      createProductItemElement(elemento);
    });
  });
}

function getSaleAPI(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => response.json())
  .then((productObject) => {
    createCartItemElement(productObject);
  });
}

function createListener() {
const bodyCall = document.body;
bodyCall.addEventListener('click', (event) => {
  const itemCart = event.target;
  if (itemCart.classList.contains('item__add')) {
   const itemId = getSkuFromProductItem(itemCart.parentNode);
  getSaleAPI(itemId);   
  }
  });
}

function buttonclearCart() {
  const bodys = document.body;
  const lista = document.querySelector('.cart__items');
  bodys.addEventListener('click', (event) => {
    const button = event.target;
    if (button.classList.contains('empty-cart')) {
      lista.innerHTML = '';
    }
  });
}

/* function createCartList() {

} */

window.onload = () => { 
  getAPI();
  createListener();
  buttonclearCart();
};
