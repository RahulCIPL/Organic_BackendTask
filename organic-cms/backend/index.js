import express, { json } from "express";

import { connect, connection as _connection } from "mongoose";

import cors from "cors";

require("dotenv").config();

// set up express
const app = express();
app.use(json());

//middlewares
app.use(cors());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`The server has started on port: ${PORT}`));

/*Mongoose Connection start*/
const uri = process.env.ATLAS_URI;

connect(
  uri,
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
);

const connection = _connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});
/*Mongoose Connection end */

/* set up routes start */
const usersRouter = require('./routes/users');

app.use('/users', usersRouter);
/* set up routes end */