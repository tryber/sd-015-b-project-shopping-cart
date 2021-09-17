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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

const setItensOnPage = (response) => {
  const itens = [];
  response.results.forEach((res) =>
    itens.push({ sku: res.id, name: res.title, image: res.thumbnail }));
  const mySection = document.getElementsByClassName('items')[0];
  itens.forEach((element) => mySection.appendChild(createProductItemElement(element)));
  return undefined;
};

const getFetch = (url, onSucess, onFail) => {
  fetch(url)
    .then((response) => response.json())
    .then((response) => onSucess(response))
    .catch((error) => onFail(error));
};

async function getProductsList(product) {
  try {
    const urlSearch = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
    return await getFetch(urlSearch, setItensOnPage, console.log);
  } catch (error) {
    console.log(`erro encontrado no bloco getProductList(): ${error}`);
  }
}

window.onload = () => {
  const product = 'computador';
  getProductsList(product);
};
