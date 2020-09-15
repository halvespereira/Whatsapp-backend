const express = require("express");
const mongoose = require("mongoose");
const messagecontent = require("./dbmessages");
const cors = require("cors");
require("dotenv").config();

const path = require("path");
//App config
const app = express();
const PORT = process.env.PORT || 9000;

//DB Config
const URL_DB =
  "mongodb+srv://admin:nP3N5LCfq1uDt6wN@cluster0.uffwi.mongodb.net/whatsappdb?retryWrites=true&w=majority";

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/whatsapp-project-hp",
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const Messages = messagecontent.messagecontent;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API Router
app.get("/", (req, res) => {
  res.status(200).send("hello world");
});

app.get("/messages/sync", (req, res) => {
  Messages.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.post("/messages/new", (req, res) => {
  const dbMessage = req.body;
  Messages.create(dbMessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

//Listen
app.listen(PORT, console.log(`Server is working on port ${PORT}`));

//nP3N5LCfq1uDt6w
