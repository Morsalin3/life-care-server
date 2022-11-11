const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

        // get services
        app.get('/services', async(req, res)=>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
        //get a serviec details
        app.get('/details/:id', async(req, res)=>{
            const id = req.params.id;
            console.log(id)
            const query = {_id: ObjectId(id)};
            const details = await serviceCollection.findOne(query);
            res.send(details)
        });
        // post a service on database
        app.post('/service', async(req, res)=>{
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result);
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