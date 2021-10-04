showTotalPrice(total)
const total = total + price;

function showTotalPrice(totalPrice) {
  const recoverArea = document.querySelector('.cart');
  const priceP = document.createElement('p');

  recoverArea.classList.add('total-price');
  priceP.innerText = `Preço Total: R$ ${totalPrice}`;

  recoverArea.appendChild(priceP);
}