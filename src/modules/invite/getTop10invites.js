const { inviteModel } = require("./inviteRepository");

const getTop10Invites = async (guildId) => {
  let invites = await inviteModel
    .find({ guildId })
    .sort({ uses: "descending" });
  if (Array.isArray(invites)) {
    invites = invites.map((invite) => {
      return {
        inviterName: invite.inviterName,
        inviterId: invite.inviterId,
        code: invite.code,
        uses: invite.uses,
      };
    });
    return invites.slice(0, 10);
  }
  return [];
};

module.exports = getTop10Invites;
