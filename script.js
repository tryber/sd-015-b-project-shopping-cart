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
  event.target.remove();
}

async function sumPrices(param) {
  const p = document.querySelector('.total-price');
  p.innerHTML = (p.innerHTML === '') ? p.innerHTML = param
  : p.innerHTML = parseFloat(p.innerHTML) + param;
  return p.innerHTML;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  sumPrices(salePrice);
  return li;
}

const requestAndAddToCart = async (event) => {
  try {
    const id = event.target.parentNode.firstChild;
    const response = await fetch(`https://api.mercadolibre.com/items/${id.innerText}`);
    const convertedResponse = await response.json();
    const idNameSalePrice = { 
      sku: convertedResponse.id, 
      name: convertedResponse.title, 
      salePrice: convertedResponse.price, 
    };
    const returnedElement = createCartItemElement(idNameSalePrice);
    const cartItems = document.querySelector('.cart__items');
    cartItems.appendChild(returnedElement);
  } catch (error) {
    console.log(error);
  }
};

function addListnerToButton() {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => {
  button.addEventListener('click', requestAndAddToCart);
  // button.addEventListener('click', cleanPrice);
  });
}

const requestProducts = async (product) => {
  try {
    const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`);
    const productJson = await response.json();
    const finalResult = productJson.results;

    finalResult.forEach((element) => {
      const idNameAndImage = { sku: element.id, name: element.title, image: element.thumbnail };
      const appendProducts = createProductItemElement(idNameAndImage);
      const mainSection = document.querySelector('.items');
      mainSection.appendChild(appendProducts);
    });
    addListnerToButton();
  } catch (error) {
    console.log(error);
  }
};

function cleanShopCart(event) {
  const result = event.target.nextElementSibling;
  result.innerHTML = '';
  return result;
}

// function cleanPrice() {
//   const result = document.querySelector('.final-price');
//   result.innerHTML = '';
//   return result;
// }

window.onload = () => { 
  requestProducts('computador');
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', cleanShopCart);
  const finalPrice = document.createElement('p');
  finalPrice.className = 'total-price';
  const sectionCart = document.querySelector('.cart');
  sectionCart.appendChild(finalPrice);
};
