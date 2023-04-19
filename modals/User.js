const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  userName: { type: String, required: true, unique: true },
  ID: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("User", userSchema);
