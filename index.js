const express = require('express');
const path = require('path');
const hbs = require('hbs');
const calculate = require('./src/util/calculate.js');
const fetchData = require('./src/util/fetch-data.js');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const connectionURL = 'mongodb://kdijokas:H48fG59HMn7qWab2XBeof0vhU8LeoVr5fPv7vXEsbIerVLVVJLuvAnI1dL6sdj7752VsgTCk4D9TAWrV3Wvm1Q==@kdijokas.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@kdijokas@';
const databaseName = 'rates';

const app = express();
const publicDirectory = path.join(__dirname, '/public');
const viewsPath = path.join(__dirname, 'src/views');

app.set('view engine', 'hbs');
app.set('views', viewsPath);
app.use(express.static(publicDirectory));


app.get('/', (req, res) => {
    res.render('index');
    fetchData();
})

app.get('/calculate', (req, res) => {
    const result = calculate(req.query['currencyOne'], req.query['amountOne'], req.query['currencyTwo']);
    res.send(result);

    MongoClient.connect(connectionURL, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
        if (err) {
           return console.log(err);
        } 
        const db = client.db(databaseName);
        // db.collection('User-data').insertOne(result, (err, result) => {
        //     if (err) {
        //         return console.log('Unable to insert data');
        //     }
        //     console.log(result.ops);
        // })

        // db.collection('users').findOne({ name: 'Jen'}, (err, item) => {
        //     if (err) {
        //         console.log('err');
        //     }
        //     console.log(item);
        // })
    });
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('app is running');
})