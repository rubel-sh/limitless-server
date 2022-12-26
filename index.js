const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const cors = require("cors");

// Variables
const PORT = process.env.PORT || 5001;
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conntect DB

const uri = `mongodb+srv://${process.env.DBNAME}:${process.env.DBPASS}@cluster0.bttp39i.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("database connected");
  } catch (err) {
    console.log(err);
  }
}
// Call the server
connectDB();

// Database Collections
const usersCollection = client.db("HealthOS_Test").collection("users");
const productsCollection = client.db("HealthOS_Test").collection("products");
const customersCollection = client.db("HealthOS_Test").collection("customers");

// Server Running
app.get("/", async (req, res) => {
  res.send("Server is running");
});

// Create user using phone and password
app.put("/api/register", async (req, res) => {
  try {
    const phone = req.body.phone;
    const password = req.body.password;
    const query = { phone, password };
    console.log(query);
    const createdUser = await usersCollection.insertOne(query);
    res.send(createdUser);
  } catch (err) {
    console.log(err);
  }
});

// Generate JWT token for sign in
app.post("/api/login", async (req, res) => {
  const phone = req.body.phone;
  const password = req.body.password;
  const query = { phone, password };
  console.log(query);
  const user = await usersCollection.findOne(query);

  if (user) {
    const token = jwt.sign({ phone }, process.env.JWT_TOEKN_SECRET, {
      expiresIn: "1d",
    });
    return res.send({ accessToken: token });
  }
  res.status(403).send({ accessToken: "" });
});

// get all customers
app.get("/api/customers", async (req, res) => {
  try {
    const customers = await customersCollection.find({}).toArray();
    res.send(customers);
  } catch (err) {
    console.log(err);
  }
});

// update customers temporarily
// app.put("/api/customers", async (req, res) => {
//   try {
//     const filter = {};
//     const updateDoc = {
//       $set: {
//         phone: "+8801980728221",
//         email: "mercado.ce@hotmail.com",
//       },
//     };
//     const customers = await customersCollection.updateMany(filter, updateDoc, {
//       upsert: true,
//     });
//     res.send(customers);
//   } catch (err) {
//     console.log(err);
//   }
// });

// get all products
app.get("/api/products", async (req, res) => {
  try {
    const customers = await productsCollection.find({}).toArray();
    res.send(customers);
  } catch (err) {
    console.log(err);
  }
});

app.listen(PORT, () => "Server running on port" + PORT);
