function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const arrayPrice = [];
function sumTotal() {
  const p = document.querySelector('.total-price');
  const total = arrayPrice.reduce((element, elementAtual) => element + elementAtual, 0);
  p.innerText = parseFloat((total).toFixed(2));
}

function removePrice(Li) {
  const p = document.querySelector('.total-price');
  const total = arrayPrice.reduce((element, elementAtual) => element + elementAtual, 0);
  const text = Li.innerText.split(' ');
  const Qnumb = text[text.length - 1];
 const number = [`${Qnumb[1]}${Qnumb[2]}${Qnumb[3]}${Qnumb[4]}${Qnumb[5]} ${Qnumb[6]} `];
 const Convert = parseFloat(number);
 const ntotal = total - Convert;
  p.innerText = ntotal.toFixed(1);
}

function cartItemClickListener(event) {
  const Li = event.target;
  Li.remove();
  console.log(Li);
  removePrice(Li);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addEventListenerInButtons = async (event) => {
  const selected = event.target;
  const sectionOfButons = selected.parentNode;
  const idButtonSelected = sectionOfButons.firstChild;
   await fetch(`https://api.mercadolibre.com/items/${idButtonSelected.innerText}`)
  .then((res) => res.json())
  .then(({ id, title, price }) => {
    const items = {
      sku: id,
      name: title,
      salePrice: price,
    };
    const ol = document.querySelector('.cart__items');
    ol.appendChild(createCartItemElement(items));
    const prices = items.salePrice;
    arrayPrice.push(prices);
    sumTotal();
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