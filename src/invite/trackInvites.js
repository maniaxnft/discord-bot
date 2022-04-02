const Discord = require("discord.js");
const { inviteModel } = require("./inviteRepository");

const trackInvites = () => {
  const bot = new Discord.Client({
    intents: [
      Discord.Intents.FLAGS.GUILDS,
      Discord.Intents.FLAGS.GUILD_MESSAGES,
      Discord.Intents.FLAGS.GUILD_MEMBERS,
      Discord.Intents.FLAGS.GUILD_PRESENCES,
    ],
  });
  bot.login(process.env.DISCORD_TOKEN);

  bot.on("ready", () => {
    console.log("Invite tracker bot is ready to use!");
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
              inviteCount: invite.uses,
            },
            { upsert: true }
          );
        });
      } else {
        console.error("firstInvites could not be found");
      }
    });
  });

  bot.on("inviteDelete", (invite) => {
    console.log("inviteDelete!");
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
    console.log("inviteCreate!");
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
    const invite = currentInvites.find(async (i) => {
      const invite = await inviteModel.findOne({ code: i.code });
      if (i.code === invite.code) {
        return i;
      }
    });
    const inviter = await bot.users.fetch(invite.inviter?.id);

    if (inviter) {
      const theInvite = await inviteModel.findOne({
        guildId: member.guild.id,
        code: invite.code,
      });
      await inviteModel.findOneAndUpdate(
        {
          guildId: member.guild.id,
          code: invite.code,
        },
        {
          inviteCount: theInvite.inviteCount + 1,
        }
      );
      const inviteTrackerChannel = await bot?.channels?.cache?.get(
        process.env.DISCORD_INVITE_TRACKER_CHANNEL_ID
      );
      if (inviteTrackerChannel) {
        inviteTrackerChannel.send(
          `${member.user.tag} joined using invite code ${invite.code} from ${inviter.tag}. Invite was used ${invite.uses} times.`
        );
      }
    } else {
      console.error("Inviter could not be found \n");
      const botInfoChannel = await bot?.channels?.cache?.get(
        process.env.DISCORD_BOT_INFO_CHANNEL_ID
      );
      if (botInfoChannel) {
        botInfoChannel.send(
          `${member.user.tag} joined but I couldn't find through which invite.`
        );
      }
    }
  });

  bot.on("guildMemberRemove", async (member) => {
    const currentInvites = await member.guild?.invites?.fetch();
    const invite = currentInvites.find(async (i) => {
      const invite = await inviteModel.findOne({ code: i.code });
      if (i.uses > invite.inviteCount) {
        return i;
      }
    });

    const inviter = await bot.users.fetch(invite.inviter?.id);
    if (inviter) {
      const theInvite = await inviteModel.findOne({
        guildId: member.guild.id,
        code: invite.code,
      });
      await inviteModel.findOneAndUpdate(
        {
          inviterId: invite.inviterId,
          inviterName: invite.inviter?.username,
          guildId: member.guild.id,
          code: invite.code,
        },
        {
          inviteCount: theInvite.inviteCount - 1,
        }
      );
    }
  });
};

module.exports = trackInvites;
