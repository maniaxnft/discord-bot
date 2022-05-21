const mongoose = require("mongoose");

const tweetSchema = mongoose.Schema({
  tweetId: {
    type: String,
  },
});
const tweetModel = mongoose.model("tweet", tweetSchema);
module.exports = tweetModel;
