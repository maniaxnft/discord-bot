const Discord = require("discord.js");
const { inviteModel } = require("./inviteRepository");

const trackInvites = () => {
  const bot = new Discord.Client({
    intents: [
      Discord.Intents.FLAGS.GUILDS,
      Discord.Intents.FLAGS.GUILD_MESSAGES,
    ],
  });
  bot.login(process.env.DISCORD_TOKEN);

  bot.on("ready", () => {
    console.log("Invite tracker bot is ready to use!");
    bot.guilds.cache.forEach(async (guild) => {
      const firstInvites = await guild.invites.fetch();
      firstInvites.map(async (invite) => {
        await inviteModel.findOneAndUpdate(
          { inviterId: invite.inviterId, guildId: guild.id, code: invite.code },
          {
            inviterId: invite.inviterId,
            inviterName: invite.inviter?.username,
            guildId: guild.id,
            code: invite.code,
            inviteCount: invite.uses,
          },
          { upsert: true }
        );
      });
    });
  });

  bot.on("inviteDelete", (invite) => {
    if (invite?.guild?.id && invite.code) {
      inviteModel.findOneAndDelete({
        guildId: invite.guild.id,
        code: invite.code,
      });
    } else {
      console.error("Necessary parameters not coming for inviteDelete");
    }
  });

  bot.on("inviteCreate", (invite) => {
    if (invite.inviter?.id && invite.guild?.id && invite.uses) {
      inviteModel.create({
        inviterId: invite.inviterId,
        inviterName: invite.inviter?.username,
        guildId: invite.guild.id,
        code: invite.code,
        inviteCount: invite.uses,
      });
    } else {
      console.error("Necessary parameters not coming for inviteCreate");
    }
  });

  bot.on("guildCreate", (guild) => {
    guild.invites.fetch().then((guildInvites) => {
      guildInvites.map((invite) => {
        inviteModel.create({
          inviterId: invite.inviterId,
          inviterName: invite.inviter?.username,
          guildId: invite.guild.id,
          code: invite.code,
          inviteCount: invite.uses,
        });
      });
    });
  });

  bot.on("guildDelete", (guild) => {
    inviteModel.deleteMany({ guildId: guild.id });
  });

  bot.on("guildMemberAdd", async (member) => {
    const currentInvites = await member.guild?.invites?.fetch();
    const existingInvites = await inviteModel.find({
      guildId: member.guild?.id,
    });

    const invite = currentInvites.find(
      (i) => i.inviteCount > existingInvites.get(i.code)
    );
    const inviter = await bot.users.fetch(invite.inviter?.id);
    const logChannel = member.guild.channels.cache.find(
      (channel) =>
        channel.name === process.env.DISCORD_INVITE_TRACKER_CHANNEL_NAME
    );
    if (inviter) {
      await inviteModel.create({
        inviterId: invite.inviterId,
        inviterName: invite.inviter?.username,
        guildId: member.guild.id,
        code: invite.code,
        inviteCount: invite.uses,
      });
      if (logChannel) {
        logChannel.send(
          `${member.user.tag} joined using invite code ${invite.code} from ${inviter.tag}. Invite was used ${invite.uses} times.`
        );
      } else {
        console.error("logChannel could not be found");
      }
    }

    if (!inviter) {
      console.error("Inviter could not be found");
      const infoChannel = member.guild?.channels?.cache?.find(
        (channel) => channel.name === process.env.DISCORD_BOT_INFO_CHANNEL_NAME
      );
      if (infoChannel) {
        infoChannel.send(
          `${member.user.tag} joined but I couldn't find through which invite.`
        );
      } else {
        console.error("infoChannel could not be found");
      }
    }
  });
};

module.exports = trackInvites;
