const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
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

// Login
UserSchema.methods.matchPassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};

// Register
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("users", UserSchema); //users: ten collection trong DB
