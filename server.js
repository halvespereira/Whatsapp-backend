const express = require("express");
const mongoose = require("mongoose");
const messagecontent = require("./dbmessages");
const Pusher = require("pusher");
const cors = require("cors");

const path = require("path");
//App config
const app = express();
const PORT = process.env.PORT || 8080;

const pusher = new Pusher({
  appId: "1071953",
  key: "83b1990dfbf005086c07",
  secret: "10c4b2d1ad0a41efc880",
  cluster: "us2",
  encrypted: true,
});

//DB Config
const URL_DB =
  "mongodb+srv://admin:nP3N5LCfq1uDt6wN@cluster0.uffwi.mongodb.net/whatsappdb?retryWrites=true&w=majority";

mongoose.connect(process.env.MONGODB_URI || URL_DB, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Messages = messagecontent.messagecontent;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const db = mongoose.connection;

db.once("open", () => {
  console.log("DB connected");

  const msgCollection = db.collection("messagecontents");
  const changeStream = msgCollection.watch();

  changeStream.on("change", (change) => {
    console.log(change);

    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
        received: messageDetails.received,
      });
    } else {
      console.log("Error triggering Pusher");
    }
  });
});

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
