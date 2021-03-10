const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

require("dotenv").config();

// set up express
const app = express();
app.use(express.json());

//middlewares
app.use(cors());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`The server has started on port: ${PORT}`));

/*Mongoose Connection start*/
const uri = process.env.ATLAS_URI;

mongoose.connect(
  uri,
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
);

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});
/*Mongoose Connection end */