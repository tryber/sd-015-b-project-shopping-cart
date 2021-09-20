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

const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

async function getComputer() { 
    const data = await fetch(API_URL);
    const getComputerSearch = await data.json();
    console.log(getComputerSearch.results);
    return getComputerSearch.results.forEach(({ id, title, thumbnail }) => {
      const resultPromisse = {
        sku: id,
        name: title,
        image: thumbnail,
      };
      const selectItems = document.querySelector('.items');
      const product = createProductItemElement(resultPromisse);
      selectItems.appendChild(product);
    });
}

function cartItemClickListener(event) {
  // coloque seu código aqu 
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = () => { 
  getComputer(); 
};
