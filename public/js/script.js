
const currencies = [];

fetch('https://cors-anywhere.herokuapp.com/http://lb.lt//webservices/FxRates/FxRates.asmx/getCurrentFxRates?tp=EU').then(response => response.text()).then(data => {
const xml = data;  
const parser = new DOMParser();
const xmlDoc = parser.parseFromString(xml, "text/xml");

const fxRates = xmlDoc.getElementsByTagName('FxRate');
// for (let i = 0; i<xmlDoc)
console.log(xmlDoc);


// Changes XML to JSON
function xmlToJson(xmlDoc) {
	
	// Create the return object
	let obj = {};

	if (xmlDoc.nodeType == 1) { // element
		// do attributes
		if (xmlDoc.attributes.length > 0) {
		obj["@attributes"] = {};
			for (let j = 0; j < xmlDoc.attributes.length; j++) {
				let attribute = xmlDoc.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xmlDoc.nodeType == 3) { // text
		obj = xmlDoc.nodeValue;
	}

	// do children
	if (xmlDoc.hasChildNodes()) {
		for(let i = 0; i < xmlDoc.childNodes.length; i++) {
			let item = xmlDoc.childNodes.item(i);
			let nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					let old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
};

const jsonRates = xmlToJson(xmlDoc);
// currency
console.log(jsonRates.FxRates.FxRate[0].CcyAmt[1].Ccy['#text']);
// value
console.log(jsonRates.FxRates.FxRate[0].CcyAmt[1].Amt['#text']);

for (let i = 0; i<jsonRates.FxRates.FxRate.length; i++) {
  const obj = {
    currency: jsonRates.FxRates.FxRate[i].CcyAmt[1].Ccy['#text'],
    rate: jsonRates.FxRates.FxRate[i].CcyAmt[1].Amt['#text']
  }
  currencies.push(obj)
}
console.log(currencies);

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
const rate = document.getElementById("rate");
const form = document.querySelector('form');
const date = document.getElementById('date');

swap.addEventListener("click", (event) => {
    const temp = currencyOne.value;
    currencyOne.value = currencyTwo.value;
    currencyTwo.value = temp;
    // calculateRate();
});


form.addEventListener('submit', e => {
  e.preventDefault();

fetch(`localhost:3000/calculate?currencyOne=${currencyOne.value}&amountOne=${amountOne.value}&currencyTwo=${currencyTwo.value}`).then(res => {
	res.json().then(data => {
		amountTwo.value = data.answer;
		rate.innerHTML = data.text;
		date.innerHTML = data.date;
	})
})
})