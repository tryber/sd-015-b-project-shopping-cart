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

const fetchGetComputers = () => {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';

  const fetcH = fetch(url)
    .then((response) => response.json())
    .then((computers) => {
      const lista = computers.results.reduce((previousValue, currentValue) => {
        previousValue.push(currentValue);
        return previousValue;
      }, []);
      return lista;
    });
  return fetcH;
};

function getFetchProductId(idItem) {
  const url = `https://api.mercadolibre.com/items/${idItem}`;
  const ol = document.querySelector('.cart__items');

  fetch(url)
  .then((response) => response.json())
  .then(({ id, title, price }) => {
    ol.appendChild(createCartItemElement({ sku: id, name: title, salePrice: price }));
  });
}

window.onload = () => {
  fetchGetComputers()
    .then((response) => {
      response.forEach(({ id, title, thumbnail }) => {
        const section = document.querySelector('.items');
        section.appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail }));
      });
    })
    .then(() => {
      const produtos = [...document.getElementsByClassName('item')];
      console.log(produtos);
      produtos.forEach((element) => {
        element.childNodes[3].addEventListener('click', () => {
          console.log(element.firstChild.textContent);
          getFetchProductId(element.firstChild.textContent);
        });
      });
    });
};
