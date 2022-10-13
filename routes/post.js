const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  description: String,
});

module.exports = mongoose.model("Post", postSchema);
