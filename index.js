const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000 ;
 
// middle wares
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ojgvcnk.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        const serviceCollection = client.db('lifeCare').collection('services');
        const reviewCollection = client.db('lifeCare').collection('reviews');

        // get services with limit
        app.get('/services', async(req, res)=>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        });
        // get all service
        app.get('/allservices', async(req, res)=>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
        //get a serviec details
        app.get('/details/:id', async(req, res)=>{
            const id = req.params.id;
            // console.log(id)
            const query = {_id: ObjectId(id)};
            const details = await serviceCollection.findOne(query);
            res.send(details)
        });
        // post a service on database
        app.post('/services', async(req, res)=>{
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        })
        // post reviews
        app.post('/reviews', async(req, res)=>{
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })
        // my reviews
        app.get('/reviews', async(req, res)=>{
            console.log(req.query.email)
            let query = {};

            if(req.query.email){
                query={
                    email: req.query.email
                } 
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews)
        })
        
        // querry reviews
        app.get('/reviews', async(req, res)=>{
            console.log(req.query.service_id)
            let query = {};

            if(req.query.service_id){
                query={
                    service_id: req.query.service_id
                } 
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews)
        })

        
    }
    finally{

    }
}

run().catch(error =>console.error(error));


app.get('/', (req, res)=>{
    res.send('life care server in running');
})

app.listen(port, ()=>{
    console.log(`life care server is running on prot:${port}`)
});