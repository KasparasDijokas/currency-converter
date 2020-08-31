const fs = require('fs');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

// const connectionURL = 'mongodb://kdijokas:H48fG59HMn7qWab2XBeof0vhU8LeoVr5fPv7vXEsbIerVLVVJLuvAnI1dL6sdj7752VsgTCk4D9TAWrV3Wvm1Q==@kdijokas.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@kdijokas@';
const connectionURL = 'mongodb://localhost:27017';
const databaseName = 'rates';

const calculate = (currencyOne, amountOne, currencyTwo) => {
    MongoClient.connect(connectionURL, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
      if (err) {
         return console.log(err);
      } 
      const db = client.db(databaseName);
      const value = db.collection('FxRates').find().toArray( (err, result) => {

        const rateValue = +result[0][currencyTwo] / +result[0][currencyOne];
        const message = `1 ${currencyOne} = ${+result[0][currencyTwo] / +result[0][currencyOne]} ${currencyTwo}`;
        const amount = (+amountOne * rateValue).toFixed(2);
        const resultMessage = `${amountOne} ${currencyOne} = ${amount} ${currencyTwo}`;
        const obj = {
            rate: rateValue,
            text: message,
            answer: resultMessage,
            // date: `Last updated: ${parsedData.FxRates.FxRate[0].Dt[0]}`
            date: resultMessage
        }
        console.log(obj);
        return obj;
      }); 
  }); 
}

module.exports = calculate;