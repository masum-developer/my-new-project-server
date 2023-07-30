const express = require('express')
const app = express();
const cors = require('cors');

require('dotenv').config()

const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.obrngag.mongodb.net/?authSource=admin`;

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
   
    const collegeCollection = client.db("martialDb").collection("colleges");
    
    app.post('/colleges', async (req, res) => {
        const collegeItem = req.body;
        console.log(collegeItem);
        const result = await collegeCollection.insertOne(collegeItem);
       return res.send(result);
      })
    

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
 return res.send('Admission is running')
})
app.listen(port, () => {
  console.log(`Admission is running on port: ${port}`)
})