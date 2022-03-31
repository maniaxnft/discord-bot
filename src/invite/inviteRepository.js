const mongoose = require("mongoose");

const inviteSchema = mongoose.Schema({
  guildId: String,
  code: String,
  inviteCount: String,
});
const inviteModel = mongoose.model("invite", inviteSchema);

module.exports = {
  inviteModel,
};
