const { wait } = require("../../utils");
const { inviteModel } = require("./inviteRepository");

const trackInvites = (bot) => {
  bot.on("ready", async () => {
    await wait(1000);
    console.log("Invite tracker bot is ready to use!");
    initInvites(bot);
  });

  bot.on("inviteDelete", async (invite) => {
    await wait(1000);
    if (invite?.guild?.id && invite.code) {
      inviteModel.findOneAndDelete({
        guildId: invite.guild.id,
        code: invite.code,
      });
    } else {
      console.error("Necessary parameters not coming for inviteDelete");
    }
  });

  bot.on("inviteCreate", async (invite) => {
    await wait(1000);
    if (invite.inviter?.id && invite.guild?.id && invite.uses) {
      inviteModel.create({
        inviterId: invite.inviterId,
        inviterName: invite.inviter?.username,
        guildId: invite.guild.id,
        code: invite.code,
        uses: invite.uses,
      });
    } else {
      console.error("Necessary parameters not coming for inviteCreate");
    }
  });

  bot.on("guildCreate", async (guild) => {
    await wait(1000);
    guild.invites.fetch().then((guildInvites) => {
      guildInvites.map((invite) => {
        inviteModel.create({
          inviterId: invite.inviterId,
          inviterName: invite.inviter?.username,
          guildId: invite.guild.id,
          code: invite.code,
          uses: invite.uses,
        });
      });
    });
  });

  bot.on("guildDelete", async (guild) => {
    await wait(1000);
    inviteModel.deleteMany({ guildId: guild.id });
  });

  bot.on("guildMemberAdd", async () => {
    await wait(1000);
    initInvites(bot);
  });
};

const initInvites = (bot) => {
  bot.guilds.cache.forEach(async (guild) => {
    const firstInvites = await guild.invites?.fetch();
    if (firstInvites) {
      firstInvites.map(async (invite) => {
        await inviteModel.findOneAndUpdate(
          {
            inviterId: invite.inviterId,
            guildId: guild.id,
            code: invite.code,
          },
          {
            inviterId: invite.inviterId,
            inviterName: invite.inviter?.username,
            guildId: guild.id,
            code: invite.code,
            uses: invite.uses,
          },
          { upsert: true }
        );
      });
    } else {
      console.error("firstInvites could not be found");
    }
  });
};

module.exports = trackInvites;
