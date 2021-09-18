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

function setCartLocal() {
  const cartList = document.querySelector('.cart__items').innerHTML;
  const saveCartList = JSON.stringify(cartList);
  localStorage.setItem('cart-list', saveCartList);
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const removeElement = event.path[0];
  removeElement.remove();
  setCartLocal();
}

function getCartLocal(cartList) {
  const actualList = cartList;
  const returnCartList = JSON.parse(localStorage.getItem('cart-list'));
  actualList.innerHTML = returnCartList;
  actualList.addEventListener('click', cartItemClickListener);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createListOfProducts(productName) {
  const sectionItems = document.querySelector('.items');
  const returnApi = fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${productName}`)
    .then((result) => result.json())
    .then((product) => {
      product.results.forEach(({ id, title, thumbnail }) => {
        const itemData = { sku: id, name: title, image: thumbnail };
        const displayProduct = createProductItemElement(itemData);
        sectionItems.appendChild(displayProduct);
      });
    });
  return returnApi;
}

function addProductToCart(olCart) {
  const buttons = document.querySelectorAll('.item__add');
  const addToCart = buttons.forEach((addButton) => {
    addButton.addEventListener('click', () => {
      const productId = addButton.parentNode.firstChild.innerText;
      const callProductData = fetch(`https://api.mercadolibre.com/items/${productId}`)
        .then((result) => result.json())
        .then((product) => {
          const itemData = { sku: product.id, name: product.title, salePrice: product.price };
          const createCartItem = createCartItemElement(itemData);
          olCart.appendChild(createCartItem);
          setCartLocal();
        });
      return callProductData;
    });
  });
  return addToCart;
}

window.onload = () => { 
  const cartList = document.querySelector('.cart__items');
  createListOfProducts('computador')
    .then(() => getCartLocal(cartList))
    .then(() => addProductToCart(cartList));    
};
