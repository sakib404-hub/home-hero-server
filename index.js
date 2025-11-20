const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, Collection } = require("mongodb");
const port = process.env.PORT || 5030;
require("dotenv").config();

//connecting the mongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@crud-operation.iftbw43.mongodb.net/?appName=CRUD-operation`;
//creating the mongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const run = async () => {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });

    console.log("You successfully connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
};

run().catch(console.dir);

// middleWare
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("The server is Running!");
});
app.listen(port, () => {
  console.log(`This app is listeing from port : ${port}`);
});
