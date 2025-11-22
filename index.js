const express = require("express");
const cors = require("cors");
const app = express();
const {
  MongoClient,
  ServerApiVersion,
  Collection,
  ObjectId,
} = require("mongodb");
const port = process.env.PORT || 5030;
require("dotenv").config();

// middleWare
app.use(cors());
app.use(express.json());

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

    // creating the database and the Collection
    const homeheroDB = client.db("homeheroDB");
    const servicesCollection = homeheroDB.collection("services");
    const bookingsCollection = homeheroDB.collection("bookings");

    //getting the latest-services
    app.get("/latest-service", async (req, res) => {
      const sortBy = {
        createdAt: -1,
      };
      const query = {};
      const cursor = servicesCollection.find(query).sort(sortBy).limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });

    // getting all the services
    app.get("/services", async (req, res) => {
      const fields = {
        _id: 1,
        title: 1,
        providerName: 1,
        providerEmail: 1,
        price: 1,
        tags: 1,
        ratings: 1,
        image: 1,
        discount: 1,
      };
      const query = {};
      const cursor = servicesCollection.find(query).project(fields);
      const result = await cursor.toArray();
      res.send(result);
    });

    // getting my services only
    app.get("/myservices", async (req, res) => {
      const email = req.query.email;
      const query = {
        providerEmail: email,
      };
      const cursor = servicesCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //posting or addding services
    app.post("/services", async (req, res) => {
      const newService = req.body;
      const result = await servicesCollection.insertOne(newService);
      res.send(result);
    });

    //getting the particular data
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await servicesCollection.findOne(query);
      res.send(result);
    });

    //updation of a service
    app.put("/service/:id", async (req, res) => {
      const updatedService = req.body;
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await servicesCollection.updateOne(query, {
        $set: updatedService,
      });
      res.send(result);
    });

    //deleting a service
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await servicesCollection.deleteOne(query);
      res.send(result);
    });

    // getting bookingInfomation by email
    app.get("/mybookings", async (req, res) => {
      const email = req.query.email;
      const query = {
        userEmail: email,
      };
      const cursor = bookingsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //posting the booking information
    app.post("/bookings", async (req, res) => {
      const newBookings = req.body;
      const result = await bookingsCollection.insertOne(newBookings);
      res.send(result);
    });

    //getting the booking infromation
    app.get("/bookings", async (req, res) => {
      const query = {};
      const cursor = bookingsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // removing from the bookings
    app.delete("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await bookingsCollection.deleteOne(query);
      res.send(result);
    });

    console.log("You successfully connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
};

run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("The server is Running!");
});
app.listen(port, () => {
  console.log(`This app is listeing from port : ${port}`);
});
