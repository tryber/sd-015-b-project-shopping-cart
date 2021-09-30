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

// Requisito 6
const clearCart = () => {
  const removeListCart = document.querySelector('.empty-cart');
  const listCartHTML = document.querySelector('.cart__items');
  
  removeListCart.addEventListener('click', () => {
    listCartHTML.innerHTML = '';
  });
};

 function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// requistio 2
const addProductToCart = (idItem) => {
  fetch(`https://api.mercadolibre.com/items/${idItem}`)
    .then((response) => response.json())
    .then(({ id, title, price }) => {
      const ol = document.querySelector('.cart__items');
      ol.appendChild(createCartItemElement({ sku: id, name: title, salePrice: price }));
    });  
};

// requisito 2
const selectItemCart = () => {
  const listButtons = document.querySelectorAll('.item__add');
  listButtons.forEach((allButtons) => {
    const selectItem = getSkuFromProductItem(allButtons.parentNode);
    allButtons.addEventListener('click', () => {
      addProductToCart(selectItem);
    });
  });
};

// Requisito 7 - Referencia: https://github.com/tryber/sd-015-b-project-shopping-cart/pull/104/files
const setLoading = (element) => {
  const items = document.querySelector('.items');
  if (element === true) {
    const h1 = document.createElement('h1');
    h1.className = 'loading';
    h1.innerText = 'loading...';
    return items.appendChild(h1);
  } if (element === false) items.firstChild.remove();
};

// requisito 1
const requestListItem = (searchedItem) => {
  setLoading(true);
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${searchedItem}`)
    .then((response) => response.json())
    .then((data) => data.results)
    .then((results) => results.forEach((element) => {
        const item = document.querySelector('.items');
        item.appendChild(createProductItemElement(
          { sku: element.id, name: element.title, image: element.thumbnail },
        ));
    }))
    .then(() => {
      setLoading(false);
      selectItemCart();
    });
};

window.onload = () => {
   requestListItem('computador');
   clearCart();
};
