const mongodb = require("mongodb");
const request = require("request");
const xml2js = require("xml2js");
const fs = require("fs");
const parser = new xml2js.Parser({ attrkey: "ATTR" });
const MongoClient = mongodb.MongoClient;

const connectionURL = 'mongodb://kdijokas:H48fG59HMn7qWab2XBeof0vhU8LeoVr5fPv7vXEsbIerVLVVJLuvAnI1dL6sdj7752VsgTCk4D9TAWrV3Wvm1Q==@kdijokas.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@kdijokas@';
// const connectionURL = "mongodb://localhost:27017";
const databaseName = "rates";

// request data from lb.lt
const fetchData = function fetchData() {
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
            saveToDatabase();
            console.log("data is fetched");
          }
        });
      }
    }
  );
};

// save data to database
function saveToDatabase() {
  MongoClient.connect(
    connectionURL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, client) => {
      if (err) {
        return console.log(err);
      }

      let rawdata = fs.readFileSync("parsedRates.json");
      let parsedData = JSON.parse(rawdata);

      const currencies = { date: parsedData.FxRates.FxRate[0].Dt[0], EUR: "1" };
      for (let i = 0; i < parsedData.FxRates.FxRate.length; i++) {
        currencies[`${parsedData.FxRates.FxRate[i].CcyAmt[1].Ccy[0]}`] = `${parsedData.FxRates.FxRate[i].CcyAmt[1].Amt[0]}`;
      }

      const db = client.db(databaseName);
      db.collection("FxRates").deleteOne({});
      db.collection("FxRates").insertOne(currencies, (err, result) => {
        if (err) {
          return console.log("Unable to insert data");
        }
      });
    }
  );
}

module.exports = fetchData;
