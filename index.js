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
    const studentCollection = client.db("martialDb").collection("students");
    const userCollection = client.db("martialDb").collection("users");

    app.get('/colleges', async (req, res) => {
        const result = await collegeCollection.find().toArray();
       return res.send(result);
      })
    app.post('/colleges', async (req, res) => {
        const collegeItem = req.body;
        console.log(collegeItem);
        const result = await collegeCollection.insertOne(collegeItem);
       return res.send(result);
      })

    app.patch('/colleges/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedCollege = req.body;
      console.log(updatedCollege);
      const updateDoc = {
        $set: {
          rating: updatedCollege.rating,
          
        },
      };
      const result = await collegeCollection.updateOne(filter, updateDoc)
     return res.send(result);

    })
    app.get('/three-colleges', async (req, res) => {
        const result = await collegeCollection.find().limit(3).toArray();;
       return res.send(result);
      })
    

    // college details
      app.get('/college/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }

      const options = {
        projection: { _id:1, name: 1, image: 1, researchHistory: 1, admissionDate: 1, events: 1,rating:1,sportsName:1}
      }
      
      const result = await collegeCollection.findOne(query, options);
      return res.send(result);
    })

     //  college search by name
    app.get("/college-name/:text", async (req, res) => {
        const text = req.params.text;
        const result = await collegeCollection
          .find({
               name: { $regex: text, $options: "i" } 
          })
          .toArray();
       return res.send(result);
      });

    app.get('/admissions', async (req, res) => {
        const result = await studentCollection.find().toArray();
       return res.send(result);
      })
    app.post('/admissions', async (req, res) => {
        const studentInfo = req.body;
        console.log(studentInfo);
        const result = await studentCollection.insertOne(studentInfo);
       return res.send(result);
      })

    app.get("/my-college/:email", async(req,res)=>{
      const result= await studentCollection.findOne({candidateEmail:req.params.email});
     return res.send(result);
    })


    app.get('/users', async (req, res) => {
      const result = await userCollection.find().toArray();
      return res.send(result);
    })

    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log(user);
      const query = { email: user.email }
      const existingUser = await userCollection.findOne(query);
      console.log('existing user: ', existingUser);
      if (existingUser) {
        return res.send({ message: 'user already exists' })
      }
      const result = await userCollection.insertOne(user);
      return res.send(result);
    })

    app.get("/users/:email", async(req,res)=>{
      const result= await userCollection.findOne({email:req.params.email});
     return res.send(result);
    })


      app.get('/profile/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }

      const options = {
        projection: { _id:1, candidateName: 1, candidateEmail: 1, collegeName: 1, addressDetails: 1}
      }
      
      const result = await userCollection.findOne(query, options);
      return res.send(result);
    })

    

      app.patch('/profile-update/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedProfile = req.body;
      console.log(updatedProfile);
      const updateDoc = {
        $set: {
          candidateName: updatedProfile.candidateName,
          candidateEmail: updatedProfile.candidateEmail,
          
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc)
      res.send(result);

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