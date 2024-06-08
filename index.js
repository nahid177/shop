const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI
const uri = process.env.DB_USER;

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
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection

    const cartcoll = client.db("shopdata").collection("cart");
    const cartADD = client.db("shopdata").collection("collection");

    app.get('/menu', async (req, res) => {
      const result = await cartcoll.find().toArray();
      res.send(result);
    });

    app.post('/collection', async (req, res) => {
      const cartItem = req.body;
      const result = await cartADD.insertOne(cartItem);
      res.send(result);
    });

    app.get('/collection', async (req, res) => {
      const result = await cartADD.find().toArray();
      res.send(result);
    });

    app.delete('/collection/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartADD.deleteOne(query);
      res.send(result);
    });

    app.put('/collection/:id', async (req, res) => {
      const id = req.params.id;
      const updatedItem = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: updatedItem,
      };
      const result = await cartADD.updateOne(filter, updateDoc);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

// Call the run function to connect to MongoDB
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send("boss is sitting");
});

app.listen(port, () => {
  console.log(`boss is sitting on port ${port}`);
});