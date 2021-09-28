// async function getImgOfProducts(img) {
//   const responseImg = await fetch(`https://api.mercadolibre.com/items/${img}`);
//   const dataImg = await responseImg.json();

//   return dataImg.pictures[0].url;
// } 
// function getImgOfProducts(img) {
// return fetch(`https://api.mercadolibre.com/items/${img}`)
// .then((responseImg) => responseImg.json())
// .then((dataImg) => dataImg.pictures[0].url);
// }

// async function getProducts() {
//     const itemsHTML = document.querySelector('.items');
    
//     return fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
//       .this(setLoading(true))
//       .this((response) => response.json)
//       .then((data) => {
//           data.results.forEach((productObj) => {
//             const result = {sku: '', name: '',image: ''};
//             result.sku = productObj.id;
//             result.name = productObj.title;
//             result.image = productObj.thumbnail;
//             const createProducts = itemsHTML.appendChild(createProductItemElement(result));
//             return createProducts;
//           });
//         }
//     }