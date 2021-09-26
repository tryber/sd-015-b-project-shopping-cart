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
  console.log('aaaa');
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getData = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((anuncio) => {
      const productArray = anuncio.results.map((element) => element);
      productArray.forEach((element) => {
        const productObj = { sku: element.id, name: element.title, image: element.thumbnail };
        const carItemObj = { sku: element.id, name: element.title, salePrice: element.price };
        const product = createProductItemElement(productObj);
        const listItem = createCartItemElement(carItemObj);
        const itemClick = () => {
          const carList = document.querySelector('.cart__items');
          carList.appendChild(listItem);
        };
        product.addEventListener('click', itemClick);
        const itemsSection = document.querySelector('.items');
        itemsSection.appendChild(product);
      });
    });
};

window.onload = () => {
  getData();
};
