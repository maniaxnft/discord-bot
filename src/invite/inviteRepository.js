const mongoose = require("mongoose");

const inviteSchema = mongoose.Schema({
  inviterId: String,
  inviterName: String,
  guildId: String,
  code: String,
  uses: String,
});
const inviteModel = mongoose.model("invite", inviteSchema);

module.exports = {
  inviteModel,
};
