const express = require("express");
const mongoose = require("mongoose");
const users = require("./users");
const cors = require("cors");
require("dotenv").config();

const path = require("path");
const { doesNotMatch } = require("assert");
//App config
const app = express();
const PORT = process.env.PORT || 9000;

//DB Config
const URL_DB =
  "mongodb+srv://admin:nP3N5LCfq1uDt6wN@cluster0.uffwi.mongodb.net/whatsappdb?retryWrites=true&w=majority";

mongoose.connect(
  URL_DB || "mongodb://localhost/whatsapp-project-hp",
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  console.log("db connected")
);

const Users = users.users;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API Router

app.get("/users/sync", (req, res) => {
  Users.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

// const dbMessage = req.body;

app.post("/user/new", (req, res) => {
  const newUser = req.body;

  Users.create(newUser, (err, data) => {
    if (err) {
      return console.log(err);
    }
  });
});

app.post("/user/add/friend", async (req, res) => {
  const { currentUser, newFriend } = req.body;

  const doc = await Users.findOne({ uid: currentUser }, (err, data) => {
    if (err) return console.log(err);
    return data;
  });

  doc.friends.push({
    name: newFriend.name,
    email: newFriend.email,
    uid: newFriend.uid,
  });

  await doc.save();

  const friend = await Users.findOne({ uid: newFriend.uid }, (err, data) => {
    if (err) return console.log(err);
    return data;
  });

  friend.friends.push({
    name: doc.name,
    email: doc.email,
    uid: currentUser,
  });

  await friend.save();
});

app.post("/user/messages/new", async (req, res) => {
  const { uid, message, friend } = req.body;

  const self = await Users.findOne({ uid: uid }, (err, data) => {
    if (err) return console.log(err);
    return data;
  });

  const friendDoc = await self.friends.find((f) => f.uid === friend.uid);

  friendDoc.messages.push({
    name: self.name,
    sender: uid,
    message: message.message,
  });

  await self.save();

  const friendAccount = await Users.findOne(
    { uid: friend.uid },
    (err, data) => {
      if (err) return console.log(err);
      return data;
    }
  );

  const selfDoc = await friendAccount.friends.find((f) => f.uid === uid);

  selfDoc.messages.push({
    name: self.name,
    sender: uid,
    message: message.message,
  });

  await friendAccount.save();
});

//Listen
app.listen(PORT, console.log(`Server is working on port ${PORT}`));

//nP3N5LCfq1uDt6w
