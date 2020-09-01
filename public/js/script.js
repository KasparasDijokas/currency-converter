// fetch data from lb.lt -- render currencies

// const cors = 'https://thingproxy.freeboard.io/fetch/';
const cors = 'https://cors-anywhere.herokuapp.com/';
fetch(`${cors}https://lb.lt//webservices/FxRates/FxRates.asmx/getCurrentFxRates?tp=EU`).then(response => response.text()).then(data => {
const xml = data;  
const parser = new DOMParser();
const xmlDoc = parser.parseFromString(xml, "text/xml");
const fxRates = xmlDoc.getElementsByTagName('FxRates')[0];

const currencies = [];

currencies.push({
	currency: "EUR",
	rate: "1"
  })
for (let i = 1; i<fxRates.childNodes.length; i+=2) {
	const obj = {
		currency: fxRates.childNodes[i].childNodes[7].childNodes[1].innerHTML,
		rate: fxRates.childNodes[i].childNodes[7].childNodes[3].innerHTML
	}
	currencies.push(obj)
}

const usd = document.querySelector('.usd-container');
const gbp = document.querySelector('.gbp-container');
const cad = document.querySelector('.cad-container');
const aud = document.querySelector('.aud-container');

function renderFooter(target, curr) {
	for (const item of currencies) {
		if (item.currency === curr.toUpperCase()) {
			const p = document.createElement('p');
			p.innerHTML = item.rate;
			target.append(p)
		}
	}
}
renderFooter(usd, 'usd');
renderFooter(gbp, 'gbp');
renderFooter(cad, 'cad');
renderFooter(aud, 'aud');

function render(target) {
  for (const value of currencies) {
    const option = document.createElement("option");
    option.value = value.currency;
    option.innerHTML = value.currency;
	target.append(option);
  }
}

render(currencyOne);
render(currencyTwo);
})

const currencyOne = document.getElementById("currency-one");
const amountOne = document.getElementById("amount-one");
const currencyTwo = document.getElementById("currency-two");
const amountTwo = document.getElementById("amount-two");

const swap = document.getElementById("swap");
const rateContainer = document.getElementById("rate");
const form = document.querySelector('form');
const date = document.getElementById('date');
const loader = document.querySelector('.loadingspinner');
const calculateBtn = document.querySelector('.myButton');

swap.addEventListener("click", (event) => {
	if (currencyOne.value === currencyTwo.value) {
		return;
	}
    const temp = currencyOne.value;
    currencyOne.value = currencyTwo.value;
    currencyTwo.value = temp;
});

// fetch user input
form.addEventListener('submit', e => {
  e.preventDefault();
  loader.classList.add('show');
  calculateBtn.classList.add('show');

  // add 'http://localhost:3000' before '/calculate?currencyOne....' to run on your local server
fetch(`/calculate?currencyOne=${currencyOne.value}&amountOne=${amountOne.value}&currencyTwo=${currencyTwo.value}`).then(res => {
	res.json().then(data => {
		rateContainer.innerHTML = data.text; 
		amountTwo.innerHTML = data.answer;
		date.innerHTML = data.date;
		loader.classList.remove('show');
		calculateBtn.classList.remove('show');
	})
})
})