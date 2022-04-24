const mongoose = require("mongoose");

const remainingWhitelistSchema = mongoose.Schema({
  count: Number,
});
const remainingWhitelistModel = mongoose.model(
  "remaining-whitelist",
  remainingWhitelistSchema
);

module.exports = {
  remainingWhitelistModel,
};
