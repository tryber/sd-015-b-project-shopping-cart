function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  img.height = 180;
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
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function getInfos() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  try {
    const response = await fetch(url);
    const jsonData = await response.json();
    return await jsonData;
  } catch (error) {
    throw new Error();
  }
}

window.onload = async () => {
  const endPointInfos = await getInfos();
  const productResults = endPointInfos.results;
  
  const sectionItems = document.querySelector('.items');

  productResults.forEach((product) => {
    const productId = product.id;
    const productName = product.title;
    const productImageId = product.thumbnail_id;
    const productImage = `https://http2.mlstatic.com/D_NQ_NP_${productImageId}-O.webp`;

    sectionItems.appendChild(
      createProductItemElement({ id: productId, name: productName, image: productImage }),
    );
  });
};
