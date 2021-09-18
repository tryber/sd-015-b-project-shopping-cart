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

async function getInfos(url) {
  const urlData = url;
  try {
    const response = await fetch(urlData);
    const jsonData = await response.json();
    return await jsonData;
  } catch (error) {
    throw new Error();
  }
}

function cartItemClickListener(element) {
  const cartItems = document.querySelector('.cart__item');

  if (cartItems.parentNode) {
    cartItems.parentNode.removeChild(element);
  }
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', () => {
    cartItemClickListener(li);
  });
  return li;
}

async function getIntemInfos(item) {
  const productId = getSkuFromProductItem(item);
  const url = `https://api.mercadolibre.com/items/${productId}`;
  const endPointInfos = await getInfos(url);
  const response = endPointInfos;
  const cartItems = document.querySelector('.cart__items');

  cartItems.appendChild(createCartItemElement({
    sku: response.id, name: response.title, salePrice: response.price,
  }));
}

async function addItemToCart() {
  const items = document.querySelectorAll('.item');
  items.forEach((item) => item.lastChild.addEventListener('click', () => {
    getIntemInfos(item);
  }));
}

async function getItemsElement() {
  const endPointInfos = await getInfos(
    'https://api.mercadolibre.com/sites/MLB/search?q=$computador',
  );
  const productResults = endPointInfos.results;
  
  const sectionItems = document.querySelector('.items');

  const result = productResults.forEach((product) => {
    const productId = product.id;
    const productName = product.title;
    const productImageId = product.thumbnail_id;
    const productImage = `https://http2.mlstatic.com/D_NQ_NP_${productImageId}-O.webp`;

    sectionItems.appendChild(
      createProductItemElement({ sku: productId, name: productName, image: productImage }),
    );
  });
  return result;
}

window.onload = async () => {
  await getItemsElement();
  await addItemToCart();
};
