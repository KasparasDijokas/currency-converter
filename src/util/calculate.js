// calculate exchange rate
function calculate(currencyOneValue, currencyTwoValue, amountOne, currencyOne, currencyTwo, updateDate) {
          const rateValue = +currencyTwoValue / +currencyOneValue;
          const message = `1 ${currencyOne} = ${+currencyTwoValue / +currencyOneValue} ${currencyTwo}`;
          const amount = (+amountOne * rateValue).toFixed(2);
          const resultMessage = `${amountOne} ${currencyOne} = ${amount} ${currencyTwo}`;
          const obj = {
              rate: rateValue,
              text: message,
              answer: resultMessage,
              date: `Last updated: ${updateDate}`
          }
          return obj;
}

module.exports = calculate;