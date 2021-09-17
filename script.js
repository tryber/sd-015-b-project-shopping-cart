function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}


function cartItemClickListener(event) { 
  document.querySelector('.cart__items').removeChild(event.target);
} 

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
} 

function addItem(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      const object = {
        sku: json.id,
        name: json.title,
        salePrice: json.price,
      };
      const li = createCartItemElement(object);
      document.querySelector('.cart__items').appendChild(li);
    });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image)); 

  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', () => {
    addItem(sku);
  });
  section.appendChild(button);
  return section;
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function loadStorage() {}

const loading = async () => {
  const api = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computer');
  const data = await api.json();
  document.querySelector('.loading').remove(data);
};

window.onload = () => {
  listProducts();
  loadStorage();
  loading();
  
};
