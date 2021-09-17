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

async function fetchPCs() {
  try {
    const res = await fetch("https://api.mercadolibre.com/sites/MLB/search?q=computador");
    const data = await res.json()
    return data;
  } catch (error) {
    console.log(error);
  }
}
async function setupProductList() {
  const itemList = document.querySelector('.items');

  data = await fetchPCs(); 
  data.results.forEach(e => {
    let product = {
      sku: e.id,
      name: e.title,
      image: e.thumbnail
    }
    const item = createProductItemElement(product);
    itemList.append(item)
  })

  const addButton = document.querySelectorAll('.item__add');
  addButton.forEach(e => {
    e.addEventListener('click', ( async ({target})=> {
      let id = target.parentNode.children[0].innerHTML;
      const data = await fetch(`https://api.mercadolibre.com/items/${id}`);
      const item = await data.json();
      let product = {
        sku: item.id,
        name: item.title,
        salePrice: item.price
      }
      document.querySelector('.cart__items').append(createCartItemElement(product));
    }))
  })
}

window.onload = () => { 
  setupProductList();
  
};
