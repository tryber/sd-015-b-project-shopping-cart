const emptyCart = document.getElementsByClassName('empty-cart');
emptyCart[0].addEventListener('click', () => {
const cart = document.getElementsByClassName('cart__items');
cart[0].innerHTML = '';
});

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(item) {
 const itemClicado = item.target;
 const cart = document.querySelector('.cart__items');
 cart.removeChild(itemClicado);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createCustomElement(element, className, innerText, sku) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;

  if (className === 'item__add') {
    e.addEventListener('click', () => {
      const promise = fetch(`https://api.mercadolibre.com/items/${sku}`);
      promise.then((resposta) => {
        const promiseJson = resposta.json();
        promiseJson.then((data) => {
          const name = data.title;
          const salePrice = data.price; const cart = document.querySelector('.cart__items');
          cart.appendChild(createCartItemElement({ sku, name, salePrice }));
        });
      });
    });
  }
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku, sku));
  section.appendChild(createCustomElement('span', 'item__title', name, sku));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', sku));

  return section;
}

function recuperaDados() {
  const promise = fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  promise.then((resposta) => {
    const promiseJson = resposta.json();
    const loading = document.getElementsByClassName('loading');
    document.body.removeChild(loading[0]);

    promiseJson.then((dados) => {
      dados.results.forEach((element) => {
        const name = element.title;
        const sku = element.id;
        const image = element.thumbnail;
        const section = document.getElementsByClassName('items');
        section[0].appendChild(createProductItemElement({ sku, name, image }));
      });
    });
  });
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

window.onload = () => { 
  recuperaDados();
};
