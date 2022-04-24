const mongoose = require("mongoose");

const remainingWhitelistSchema = mongoose.Schema({
  count: Number,
});
const remainingWhitelistModel = mongoose.model(
  "remainingWhitelistModel",
  remainingWhitelistSchema
);

module.exports = {
  remainingWhitelistModel,
};
