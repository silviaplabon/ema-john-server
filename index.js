const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require("body-parser")
app.use(cors());
app.use(bodyParser.json());
//normal setup for express cors bodyparser
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mcsxh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("ema-john-server").collection("products");
    const ordersCollection = client.db("ema-john-server").collection("orders");
    //
    // productsCollection.deleteMany({})
  app.post('/addProduct', (req, res) => {
        const products = req.body;
        console.log(products);
        productsCollection.insertOne(products)
            .then(result => {
               res.send(result.insertedCount)//important 
            })
        console.log('data')
    })
    app.get('/products', (req, res) => {
        productsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    app.get('/product/:key', (req, res) => {
        productsCollection.find({ key: req.params.key })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })
    app.post('/productsByKeys', (req, res) => {
        const productKeys= req.body;
        // console.log(productKeys)
        productsCollection.find({key: { $in: productKeys} })
        .toArray((err, documents) => {
            res.send(documents);
        }) 
    }) 
  
    
    
    app.post('/addOrder', (req, res) => {
        const order= req.body;
         ordersCollection.insertOne(order)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
})
    // http://localhost:4100/productsByKeys
   
});


app.listen(process.env.PORT || 4100, (req, res) => {
    console.log('welcome');
})
