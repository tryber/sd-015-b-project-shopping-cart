const site = 'https://api.mercadolibre.com';
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
  document.querySelector('.items').appendChild(section);

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  return li;
}// alterei essa função;

function receiveDataItem(item) {
  const itemData = createCartItemElement({
    sku: item.id,
    name: item.title,
    salePrice: item.price,
  });
  document.querySelector('.cart__items').appendChild(itemData);
}

function cartItemClickListener(event) {
  const itemId = event.target.parentNode.firstChild.innerText;

  fetch(`${site}/items/${itemId}`)
    .then((response) => response.json())
    .then((dataItem) => receiveDataItem(dataItem));
}

const fetchProduct = () => fetch(`${site}/sites/MLB/search?q=computador`)
  .then((answer) => answer.json());

const addSectionProduct = (product) => {
  const productData = createProductItemElement({
    sku: product.id,
    name: product.title,
    image: product.thumbnail,
  });
  document.querySelector('.items').appendChild(productData);

  const btnsAddToCard = document.querySelectorAll('.item__add');
  btnsAddToCard.forEach((btn) => btn.addEventListener('click', cartItemClickListener));
};

window.onload = () => {
  fetchProduct()
    .then((productData) => {
      productData.results.forEach((result) => {
        addSectionProduct(result);
      });
    });
};
