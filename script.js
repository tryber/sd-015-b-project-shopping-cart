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

function cartItemClickListener(_event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

  async function getListProducts() {
  const CompSearch = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador'); 
  const searchComput = await CompSearch.json();
  const { results } = searchComput;
  results.forEach((obj) => {
    const items = document.querySelector('.items');
    const newob = createProductItemElement({ sku: obj.id, name: obj.title, image: obj.thumbnail });
    items.appendChild(newob);
  });
}
console.log(getSkuFromProductItem);
console.log(createCartItemElement);
window.onload = () => { getListProducts(); };
