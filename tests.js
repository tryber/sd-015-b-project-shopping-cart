// async function getImgOfProducts(img) {
//   const responseImg = await fetch(`https://api.mercadolibre.com/items/${img}`);
//   const dataImg = await responseImg.json();

//   return dataImg.pictures[0].url;
// } 
// function getImgOfProducts(img) {
// return fetch(`https://api.mercadolibre.com/items/${img}`)
// .then((responseImg) => responseImg.json()
// .then((dataImg) => dataImg.pictures[0].url));
// }