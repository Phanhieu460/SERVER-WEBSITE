const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  // address: {
  //     type: String
  // },
  // phone: {
  //     type: String,
  // },
  // gender: {
  //     type: String,
  // },
  // image: {
  //     type: String
  // }
});
UserSchema.set("timestamps", true);

module.exports = mongoose.model("users", UserSchema); //users: ten collection trong DB
