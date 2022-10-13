const mongoose = require("mongoose");
const plm = require('passport-local-mongoose');


mongoose.connect("mongodb://localhost/Text-to-Speech", (err) => {
  if (err) {
    console.log("Error connecting to DB", err);
  } else {
    console.log("Succefully connected to DB");
  }
});

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  mypost:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  }]
});

userSchema.plugin(plm);


module.exports = mongoose.model("User", userSchema);
