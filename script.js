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

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;  
}

// function addCartItemElement() {  
  //   const cartButtons = document.querySelectorAll('.item__add');
  //    cartButtons.forEach((element) => {
    //      console.log(element);
    //    });
    // const getClassItem = document.getElementsByClassName('item__add');  
    // }
    async function getidItem(idItem) {
    const response = await fetch(`https://api.mercadolibre.com/items/${idItem}`);
    const objectJason = await response.json(); 
     const { id, title, price } = objectJason;
     const creatCartLi = createCartItemElement({ sku: id, name: title, salePrice: price });
     const ol = document.querySelector('.cart__items');
     ol.appendChild(creatCartLi); 
    }   
    function getButton() {
  const addCartButton = document.querySelectorAll('.item__add');
  addCartButton.forEach((button) => {
    button.addEventListener('click', (element) => {
      const idElement = (element.target.parentElement.firstChild.innerText); 
      getidItem(idElement);     
    });    
  });
} 

async function getComputerApi() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const objectJason = await response.json();
  objectJason.results.forEach(({ id, title, thumbnail }) => {
    const creatProducts = createProductItemElement({ sku: id, name: title, image: thumbnail });   
    const classItem = document.querySelector('.items');
    classItem.appendChild(creatProducts);        
});
getButton();
} 

window.onload = () => { 
  getComputerApi();   
};