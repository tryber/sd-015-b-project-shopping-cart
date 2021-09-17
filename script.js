/* eslint-disable sonarjs/no-use-of-empty-return-value */
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
  // coloque seu código aqui
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

   function getProduct() {
     return fetch(API_URL)
     .then((data) => data.json())
     .then((listItens) => listItens.results.forEach(({ id, title, thumbnail }) => { 
       const listInfos = { sku: id, name: title, image: thumbnail };
       const classItens = document.querySelector('.items');
       const createElement = createProductItemElement(listInfos);
       classItens.appendChild(createElement);
     }));
    }
   
    function fetchID(idItem) {
      const valueItem = getSkuFromProductItem(idItem);
      const API_ID = `https://api.mercadolibre.com/items/${valueItem}`;
      fetch(API_ID)
      .then((response) => response.json())
      .then(({ id, title, price }) => {
        const priceItem = {
          sku: id,
          name: title,
          salePrice: price,
        }; 
        const cartItem = createCartItemElement(priceItem); 
        const ol = document.querySelector('.cart__items');
        ol.appendChild(cartItem);   
      })
      .catch(() => console.error('Seu item não está disponivel'));
    }
     
     function botao() {
     const items = document.querySelectorAll('.item');
     items.forEach((item) => item.lastChild.addEventListener('click', () => fetchID(item)));
}

window.onload = () => { 
  getProduct()
  .then(() => botao());  
};
