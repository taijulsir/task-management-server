const express = require("express");
const app = express()
require("dotenv").config();
const cors = require("cors")
const port = process.env.PORT || 5000;

app.use(express.json())
app.use(cors())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.49cfwvw.mongodb.net/?retryWrites=true&w=majority`;


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
    // await client.connect();

    const taskCollection = client.db('taskManagementDB').collection('createTasks')

    app.post('/createTask', async (req, res) => {
      const task = req.body;
      const result = await taskCollection.insertOne(task)
      res.send(result)
    })
    app.get('/toDoList/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email }
      const result = await taskCollection.find(query).toArray()
      res.send(result)
    })
    app.get('/updatetask/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      console.log(query)
      const result = await taskCollection.findOne(query)
      res.send(result)
    })

    app.delete("/taskDelete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      console.log(query)
      const result = await taskCollection.deleteOne(query)
      console.log(result)
      res.send(result)
    })

    app.patch("/toDoList/:id", async (req, res) => {
      const data = req.body
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const updatedStatus = {
        $set: {
          email: data.email,
          priority: data.priority,
          title: data.title,
          description: data.description,
          deadline: data.deadline,
        }
      }
      const result = await taskCollection.updateOne(query, updatedStatus)
      res.send(result)
    })



    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', async (req, res) => {
  res.send("The task management server is running")
})
app.listen(port, () => {
  console.log(`The server is running on ${port} port`)
})