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
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

  const requestProducts = () => {
     fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
     .then((object) => object.json())
     .then((search) => search.results.forEach(({ id, title, thumbnail }) => {
      const myObject = {
        sku: id,
        name: title,
        image: thumbnail, 
      };
     const sections = document.getElementsByClassName('items')[0];
     const itemElement = createProductItemElement(myObject);
     sections.appendChild(itemElement);
  }))
  .catch(() => console.error('Endereço não encontrado'));
};
window.onload = () => {
 requestProducts();
};
