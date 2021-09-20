function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

async function getProductList() {
  const fetchUrl = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$"computador"')
    .then((response) => response.json());
  const result = await fetchUrl.results;
  return result;
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
  const itemClicked = event.target;
  document.addEventListener('click', itemClicked.remove())
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function getProductId(element) {
  const item = element.parentElement;
  return item.firstElementChild.innerText;
}

async function cartItems(event) {
    // consultei o repositorio da Gabrielle Murat pra pegar algumas lógicas pro requisito 2
  // https://github.com/tryber/sd-015-b-project-shopping-cart/tree/gabrielle-murat-shopping-cart
  const button = event.target;
  const productId = await getProductId(button);
  const fetchItem = await fetch(`https://api.mercadolibre.com/items/${productId}`);
  const data = await fetchItem.json();
  
  const cartList = document.querySelector('.cart__items');
  cartList.appendChild(createCartItemElement(
    { sku: data.id, name: data.title, salePrice: data.price },
));
}

async function itemsListEventAdd() {
  const itemAdd = document.querySelectorAll('.item__add');
  itemAdd.forEach((button) => button.addEventListener('click', cartItems));
}

async function createProducts() {
  const productList = await getProductList();
  const sectionItems = document.querySelector('section.items');

  productList.forEach((product) => {
    const { id, title, thumbnail } = product;
    const products = createProductItemElement({ sku: id, name: title, image: thumbnail });
    sectionItems.appendChild(products);
  });
  await itemsListEventAdd();
}

window.onload = async () => {
  createProducts();
 };
