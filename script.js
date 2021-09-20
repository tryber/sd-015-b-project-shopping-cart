function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}    

function cartItemClickListener(event) {
  // coloque seu código aqui
}  

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}  

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const requestToAddOnCart = async (itemId) => {
try {
    const response = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
    const selectedComputer = await response.json();
    const sku = selectedComputer.id;
    const name = selectedComputer.title;
    const salePrice = selectedComputer.price;
    const computerToAdd = createCartItemElement({ sku, name, salePrice });
    const listToAddTheComputerOn = document.querySelector('.cart__items');
    listToAddTheComputerOn.appendChild(computerToAdd);
  } catch (error) {
    console.log(error);
  }  
};  

const getProductId = (event) => {
  const selectedProductID = getSkuFromProductItem(event.target.parentElement);
  return (requestToAddOnCart(selectedProductID));
};    

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', (event) => getProductId(event));
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

const requestProducts = async () => {
  try {
    const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
    const data = await response.json();
    const { results } = data;
    const foundedComputers = results;
    foundedComputers.forEach((computer) => {
      const sku = computer.id;
      const name = computer.title;
      const image = computer.thumbnail;
      const items = document.querySelector('.items');
      const thisComputerElement = createProductItemElement({ sku, name, image });
      items.appendChild(thisComputerElement);
    });    
  } catch (error) {
    console.log(error);
  }    
};    

window.onload = () => {
  requestProducts();
};
