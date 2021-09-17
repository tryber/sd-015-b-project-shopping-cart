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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!')
  );

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

const API_URL_MLCOMPUTER = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

async function requestMLComputer(url) {
  try {
    return fetch(url)
      .then((response) => response.json())
      .then((data) => data.results.map(({ id, title, thumbnail }) => {
          const objt = { id, title, thumbnail };
          const sectionItems = document.querySelector('.items'); // pegando o items pra poder jogar o objt como filho dele.
          const eachComputer = createProductItemElement(objt); // usando a função previamente criada para fazer um produto. 
          return sectionItems.append(eachComputer); // colocando cada produto criado na seção de items.
        }));        
  } catch (error) {
    console.log(error);
  }
}
window.onload = () => {
  requestMLComputer(API_URL_MLCOMPUTER);
};
