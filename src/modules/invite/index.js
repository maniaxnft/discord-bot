const { sendErrorToLogChannel } = require("../../utils");
const inviteModel = require("./model");

const getTop10Invites = async (bot) => {
  const invites = await bot?.guilds?.cache
    ?.get(process.env.DISCORD_GUILD_ID)
    ?.invites?.fetch();

  const sorted = invites.sort((a, b) => {
    if (a.uses < b.uses) return 1;
    if (a.uses > b.uses) return -1;
    return 0;
  });

  const filtered = sorted
    .map((invite) => {
      return {
        uses: invite?.uses,
        username: invite?.inviter?.username,
        userid: invite?.inviter?.id,
      };
    })
    ?.slice(0, 10);

  return filtered;
};

const trackInvites = async (bot) => {
  await updateInvites(bot);

  bot.on("guildMemberAdd", async (member) => {
    try {
      const newInvites = await member.guild?.invites?.fetch();
      const oldInvites = await inviteModel.find({}).lean().exec();

      if (oldInvites) {
        const invite = newInvites.find((i) => {
          const oldInvite = oldInvites.filter(
            (oldInvite) => oldInvite.code === i.code
          );
          if (oldInvite && oldInvite[0]) {
            return i.uses > oldInvite[0].uses;
          }
        });

        if (invite) {
          const inviter = await bot.users.fetch(invite.inviter?.id);
          const channel = await bot.channels.cache.get(
            process.env.DISCORD_INVITE_TRACKER_CHANNEL_ID
          );
          if (inviter) {
            channel.send(
              `<@${member.user.id}> joined using invite code **${invite.code}** from <@${inviter.id}> . Invite was used **${invite.uses} times** since its creation.`
            );
          } else {
            channel.send(
              `<@${member.user.id}> joined but I couldn't find through which invite.`
            );
          }
        }
        await updateInvites(bot);
      }
    } catch (e) {
      console.log("Error at guildMemberAdd");
      sendErrorToLogChannel(bot, "Error at guildMemberAdd", e);
    }
  });
};

const updateInvites = async (bot) => {
  try {
    const guild = await bot.guilds?.fetch(process.env.DISCORD_GUILD_ID);
    guild.invites?.fetch().then((guildInvites) => {
      guildInvites.map(async (invite) => {
        const inviterId = invite.inviter?.id;
        const uses = invite.uses;
        const code = invite.code;
        if (!inviterId) {
          return;
        }
        await inviteModel.findOneAndUpdate(
          { inviterId },
          {
            inviterId,
            uses,
            code,
          },
          {
            upsert: true,
          }
        );
      });
    });
  } catch (e) {
    console.log("Error at updateInvites");
    throw e;
  }
};

module.exports = { getTop10Invites, trackInvites };
