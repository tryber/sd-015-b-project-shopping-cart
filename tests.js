const string = `SKU: MLB1937079157 | NAME: Pc Computador Cpu Core I5 650 + Ssd 240gb, 8gb Memória Ram 
| PRICE: $1419.85`

const number = string.match(/(PRICE: \W)/).index + 8

console.log(Number(string.slice(number)))