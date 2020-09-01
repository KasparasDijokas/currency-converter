const express = require("express");
const path = require("path");
const hbs = require("hbs");
const fetchData = require("./src/util/fetch-data.js");
const mongodb = require("mongodb");
const { send } = require("process");
const calculate = require("./src/util/calculate.js");
const MongoClient = mongodb.MongoClient;

// const connectionURL = "mongodb://localhost:27017";
const connectionURL = "mongodb://kdijokas:H48fG59HMn7qWab2XBeof0vhU8LeoVr5fPv7vXEsbIerVLVVJLuvAnI1dL6sdj7752VsgTCk4D9TAWrV3Wvm1Q==@kdijokas.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@kdijokas@";
const databaseName = "rates";

const app = express();
const publicDirectory = path.join(__dirname, "/public");
const viewsPath = path.join(__dirname, "src/views");

app.set("view engine", "hbs");
app.set("views", viewsPath);
app.use(express.static(publicDirectory));

app.get("/", (req, res) => {
  res.render("index");
  fetchData();
});

// get user input -- calculate resul -- save data to db
app.get("/calculate", (req, res) => {
  const currencyOne = req.query.currencyOne;
  const currencyTwo = req.query.currencyTwo;
  const amountOne = req.query.amountOne;

  MongoClient.connect(
    connectionURL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, client) => {
      if (err) {
        return console.log(err);
      }
      const db = client.db(databaseName);

      db.collection("FxRates")
        .find()
        .toArray((err, result) => {
          const currencyOneValue = result[0][currencyOne];
          const currencyTwoValue = result[0][currencyTwo];
          const updateDate = result[0].date;
          const obj = calculate(
            currencyOneValue,
            currencyTwoValue,
            amountOne,
            currencyOne,
            currencyTwo,
            updateDate
          );
          console.log(obj);

          db.collection("user-data").insertOne(
            {
              "currency-one": currencyOne,
              "currency-two": currencyTwo,
              amount: amountOne,
              rate: obj.rate,
              result: obj.answer,
              date: new Date(),
            },
            (err, result) => {
              if (err) {
                return console.log("Unable to insert data");
              }
            }
          );
          res.send(obj);
        });
    }
  );
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("app is running");
});
