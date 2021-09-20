function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(event) {
  const Li = event.target;
  Li.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addEventListenerInButtons = (event) => {
  const selected = event.target;
  const sectionOfButons = selected.parentNode;
  const idButtonSelected = sectionOfButons.firstChild;
  fetch(`https://api.mercadolibre.com/items/${idButtonSelected.innerText}`)
  .then((res) => res.json())
  .then(({ id, title, price }) => {
    const items = {
      sku: id,
      name: title,
      salePrice: price,
    };
    const ol = document.querySelector('.cart__items');
    ol.appendChild(createCartItemElement(items));
  });
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  // se o parametro elemento for um botao cria-se o evento de click q ativa a função geButtons
  if (element === 'button') {
    e.addEventListener('click', addEventListenerInButtons);
  }
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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

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

window.onload = () => { getListProducts(); };