const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//midlewere
app.use(cors());
app.use(express.json());

    
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@rokon.tnm65c6.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const ServicesCollection = client.db('CarMaster').collection('carServices');
    const bookingCollection = client.db('CarMaster').collection('bookings');

    app.get('/services', async (req, res)=>{
        const cursor = ServicesCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })
    app.get('/services/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)} 
        const result = await ServicesCollection.findOne(query);
        // console.log(result);
        res.send(result);
    })
    app.get('/checkout/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)} 
        const result = await ServicesCollection.findOne(query);
        console.log(result);
        res.send(result);
    })

    app.post('/bookings', async(req, res) =>{
        const booking = req.body;
        console.log(booking);
        const result = await bookingCollection.insertOne(booking);
        res.send(result);
    })
    app.get('/bookings', async(req, res)=>{
      let query = {};
      if(req.query?.email){
        query = {email: req.query.email}
      }
      const coursor = bookingCollection.find(query)
      const result = await coursor.toArray()
      res.send(result)
    })
    app.delete('/bookings/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await bookingCollection.deleteOne(query);
      res.send(result)

    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res)=>{
    res.send('car master is running')

} )

app.listen(port, () => {
    console.log(`car master is running on ${port}`);
})