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

function createProductItemElement(sku, name, image) {
  const sectionOfItems = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  
  return sectionOfItems.appendChild(section);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener() {
  // coloque seu código aqui
}

function createCartItemElement(sku, name, salePrice) {
  const cartList = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener());
  return cartList.appendChild(li);
}

async function getInfo(productID) {
  try {
    const getID = getSkuFromProductItem(productID);

    const binaryRes = await fetch(`https://api.mercadolibre.com/items/${getID}`);
    const transformJSON = await binaryRes.json();
    const { id, title, price } = await transformJSON;

    createCartItemElement(id, title, price);
  } catch (error) {
    console.log(error);
  }
}

function addToCart() {
  const cartButton = document.querySelectorAll('.item__add');

  cartButton.forEach((button) => {
    button.addEventListener('click', (originEvent) => {
      const recoverID = originEvent.target.parentElement;
      getInfo(recoverID);
    });
  });
}

async function trackMercadoItems() {
  try {
    const binaryRes = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
    const responseJSON = await binaryRes.json();
    const resultOfItems = await responseJSON.results;

    await resultOfItems.forEach((product) => {
      const { id, title, thumbnail } = product;
      createProductItemElement(id, title, thumbnail);
    });

    addToCart();
  } catch (error) {
    console.log(error);
  }
}

window.onload = () => {
  trackMercadoItems();
};
