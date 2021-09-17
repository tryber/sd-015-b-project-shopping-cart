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
  const add = document.querySelector('.items');
  return add.appendChild(section); 
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const cartItems = document.querySelector('.cart__items');
  cartItems.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function listProducts() {  
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computer')
    .then((response) => response.json())
    .then((response) => {
      response.results.forEach((item) => {
        const productItem = createProductItemElement({
          sku: item.id, 
          name: item.title,
          image: item.thumbnail,
        });
        document.querySelector('.items').appendChild(productItem);
      });
    });
}

function loadStorage() {  
}

const loading = async () => { 
  const api = await
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computer');
  const data = await api.json();
  document.querySelector('.loading').remove(data);  
};

window.onload = () => { 
  listProducts();
  loadStorage();
  loading();
};
