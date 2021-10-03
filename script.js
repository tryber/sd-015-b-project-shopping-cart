// O rquisito 5 foi feito com base no código: https://github.com/tryber/sd-015-b-project-shopping-cart/pull/83/files?authenticity_token=z8BLMoQ0T2%2BszD1MfwioX5PVc0TuMyvLq1Q4P3Xgp%2BVIuWY0wVQbLkxfz2cJozrlQoGjOVY9KbSogRrQ9bH20A%3D%3D&file-filters%5B%5D=.html&file-filters%5B%5D=.js&file-filters%5B%5D=.json#
const classCartItems = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');
const emptyCart = document.querySelector('.empty-cart');

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

function subtractPrice(index) {
  const productStorage = JSON.parse(localStorage.getItem('Cart List'));
  if (!productStorage) return;
  const product = productStorage.find((_, i) => i === index);
  const { price } = product; 
  totalPrice.innerHTML = (Number(totalPrice.innerHTML) - price);
  localStorage.setItem('totalPrice', JSON.stringify(totalPrice.innerHTML));
}

// Requisito 4 - Cria o array vazio caso não exita uma array já criado;
const containLocalStorage = () => {
  if (!localStorage.getItem('Cart List')) {
    localStorage.setItem('Cart List', JSON.stringify([]));
  }
};

// Requisito 5
function updatePrice(price) {
  totalPrice.innerHTML = Number(totalPrice.innerHTML) + Number(price);
}

// requisito 5
emptyCart.addEventListener('click', () => {
  classCartItems.innerHTML = '';
  containLocalStorage();
  totalPrice.innerHTML = 0;
  localStorage.setItem('totalPrice', JSON.stringify(0));
});

// Requisito 4 - recupera o array, converte em array novamente, insere as informações no array em forma de obj e adiciona as informações ao 'CarT List'; 
const addTolocalStorage = (sku, name, salePrice) => {
  const itemsStore = JSON.parse(localStorage.getItem('Cart List'));
  itemsStore.push({ id: sku, title: name, price: salePrice });
  
  localStorage.setItem('Cart List', JSON.stringify(itemsStore));
};

// Requisitos 3
function cartItemClickListener(event) {
  // coloque seu código aqui
  const el = event.target;
  const itemIndex = Array.from(classCartItems.children).indexOf(el);

  subtractPrice(itemIndex);
  el.remove();
}

// Requisito 6
const clearCart = () => {
  const removeListCart = document.querySelector('.empty-cart');
  // const listCartHTML = document.querySelector(classCartItems);
  
  removeListCart.addEventListener('click', () => {
    classCartItems.innerHTML = '';
  });
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Requisito 4 - Recupera as informações dentro do local storage e apenda novamente na tela caso a pagina atualize;
const requestLocalStorage = () => {
  const items = JSON.parse(localStorage.getItem('Cart List'));
  // const ol = document.querySelector(classCartItems);
  items.forEach(({ id, title, price }) => {
    classCartItems.appendChild(createCartItemElement({ sku: id, name: title, salePrice: price }));
  });
};

// requistio 2
const addProductToCart = (idItem) => {
  fetch(`https://api.mercadolibre.com/items/${idItem}`)
    .then((response) => response.json())
    .then(({ id, title, price }) => {
      // const ol = document.querySelector(classCartItems);
      classCartItems.appendChild(createCartItemElement({ sku: id, name: title, salePrice: price }));
      addTolocalStorage(id, title, price);  
      updatePrice(price);  
    });
};

// requisito 2 - recupera a classe, percorre os itens adicionando ao botoes o evento de click
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

// requisito 1, 7 e 2
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
   containLocalStorage();
   requestLocalStorage();
   clearCart();
};
