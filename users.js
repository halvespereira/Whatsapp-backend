const mongoose = require("mongoose");

// const whatsappSchema = mongoose.Schema({
//   message: String,
//   name: String,
//   timestamp: String,
//   received: Boolean,
//   friends: [],
// });

const usersSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    uid: String,
    friends: [
      {
        uid: String,
        email: String,
        name: String,
        messages: [
          {
            name: String,
            sender: String,
            message: String,
            timestamp: {
              type: Date,
              default: Date.now,
            },
          },
        ],
      },
    ],
  },
  { typePojoToMixed: false }
);

const Users = mongoose.model("users", usersSchema);

module.exports.users = Users;
