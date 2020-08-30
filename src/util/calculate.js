const request = require('request');
const xml2js = require('xml2js');
const fs = require('fs');
const parser = new xml2js.Parser({ attrkey: "ATTR" });
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const connectionURL = 'mongodb://kdijokas:H48fG59HMn7qWab2XBeof0vhU8LeoVr5fPv7vXEsbIerVLVVJLuvAnI1dL6sdj7752VsgTCk4D9TAWrV3Wvm1Q==@kdijokas.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@kdijokas@';
const databaseName = 'rates';

const fetchData = function fetchData () {
    request(
        "http://lb.lt//webservices/FxRates/FxRates.asmx/getCurrentFxRates?tp=EU",
        (error, response, body) => {
          if (error) {
            console.log(error);
          } else {
            parser.parseString(body, function (error, result) {
              if (error) {
                console.log(error);
              } else {
                fs.writeFileSync("parsedRates.json", JSON.stringify(result));
                MongoClient.connect(connectionURL, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
                  if (err) {
                     return console.log(err);
                  } 
                  const db = client.db(databaseName);
                  db.collection('FxRates').insertOne(result, (err, result) => {
                      if (err) {
                          return console.log('Unable to insert data');
                      }
                  })
              });
                console.log('data is fetched');
              }
            });
          }
        }
      );
}

module.exports.fetchData = fetchData;

const calculate = (currencyOne, amountOne, currencyTwo) => {
    fetchData();

    let rawdata = fs.readFileSync("parsedRates.json");
    let parsedData = JSON.parse(rawdata);
  
    const currencies = {};
    for (let i = 0; i<parsedData.FxRates.FxRate.length; i++) {
        currencies[`${parsedData.FxRates.FxRate[i].CcyAmt[1].Ccy[0]}`] = `${parsedData.FxRates.FxRate[i].CcyAmt[1].Amt[0]}`;
    }
    console.log('fetching');

    const rateValue = currencies[currencyTwo.toUpperCase()] / currencies[currencyOne.toUpperCase()];
    const message = `1 ${currencyOne} = ${currencies[currencyTwo.toUpperCase()] / currencies[currencyOne.toUpperCase()]} ${currencyTwo}`;
    const result = (amountOne * rateValue).toFixed(2);
    const resultMessage = `${amountOne} ${currencyOne} = ${result} ${currencyTwo}`;
    const obj = {
        rate: rateValue,
        text: message,
        answer: resultMessage,
        // date: `Last updated: ${parsedData.FxRates.FxRate[0].Dt[0]}`
        date: resultMessage
    }
    return obj;
}

module.exports.calculate = calculate;