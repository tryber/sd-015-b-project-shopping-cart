async function getProductsList() {
  const query = 'computador'
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=$${query}`;
  const reponse = await fetch(url);
  const jsonResponse = await reponse.json();
  console.log(jsonResponse.results)
}
getProductsList()