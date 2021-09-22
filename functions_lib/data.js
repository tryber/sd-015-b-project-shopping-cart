const promoCodes = {
  rafael: 0.67, // 33% desconto
  amanda: 0.97, // 3% desconto
  laurenz: 0.86, // 14% desconto
  leonardo: 0.46, // 54% desconto
  fernando: 0.12, // 88% desconto
  joaonasc: 0.03, // 97% desconto
};

function newAmountWithPromoCode(code) {
  const amountStr = document.querySelector('.total-price');
  const totalAmount = parseFloat(amountStr.innerText
    .replace('R$ ', '').replace('.', '').replace(',', '.'), 10);

  amountStr.innerText = (totalAmount * code)
    .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function addCodeWithClick() {
  const promoCodeInputValue = document.querySelector('#promo-code-input').value.toLowerCase();

  if (promoCodes[promoCodeInputValue]) newAmountWithPromoCode(promoCodes[promoCodeInputValue]);
}

export function addCodeWithEnter(event) {
  if (event.key === 'Enter') {
    const promoCodeInputValue = document.querySelector('#promo-code-input').value.toLowerCase();

    if (promoCodes[promoCodeInputValue]) newAmountWithPromoCode(promoCodes[promoCodeInputValue]);
  }
}

export function togleBlackScreen() {
  const blackScreen = document.querySelector('#black-screen');
  if (blackScreen.style.zIndex === '-1') {
    blackScreen.style.zIndex = '0';
    blackScreen.style.opacity = '50%';
    return;
  }
  blackScreen.style.zIndex = '-1';
  blackScreen.style.opacity = '0%';
}
