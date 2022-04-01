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

  const wait = require("timers/promises").setTimeout;

  bot.on("ready", async () => {
    await wait(1000);

    bot.guilds.cache.forEach(async (guild) => {
      const firstInvites = await guild.invites.fetch();
      firstInvites.map(async (invite) => {
        const inviter = await bot.users.fetch(invite.inviter.id);
        await inviteModel.findOneAndUpdate(
          { inviter, guildId: guild.id, code: invite.code },
          {
            inviteCount: invite.uses,
          },
          { upsert: true }
        );
      });
    });
  });

  bot.on("inviteDelete", async (invite) => {
    const invites = await inviteModel.find({ guildId: invite.guild.id });
    if (Array.isArray(invites)) {
      invites.forEach((invite) => {
        inviteModel.findOneAndDelete({ code: invite.code });
      });
    }
  });

  bot.on("inviteCreate", (invite) => {
    inviteModel.create({
      guildId: invite.guild.id,
      code: invite.code,
      inviteCount: invite.uses,
    });
  });

  bot.on("guildDelete", async (guild) => {
    const invites = await inviteModel.find({ guildId: guild.id });
    if (Array.isArray(invites)) {
      invites.forEach((invite) => {
        inviteModel.findOneAndDelete({ guildId: invite.guildId });
      });
    }
  });

  bot.on("guildMemberAdd", async (member) => {
    const newInvites = await member.guild.invites.fetch();
    const oldInvites = await inviteModel.find({
      guildId: member.guild.id,
    });
    const invite = newInvites.find(
      (i) => i.inviteCount > oldInvites.get(i.code)
    );
    const inviter = await bot.users.fetch(invite.inviter.id);
    const logChannel = member.guild.channels.cache.find(
      (channel) => channel.name === process.env.INVITE_TRACKER_CHANNEL_NAME
    );
    if (inviter) {
      await inviteModel.create({
        inviter,
        guildId: member.guild.id,
        code: invite.code,
        inviteCount: invite.uses,
      });
      if (logChannel) {
        logChannel.send(
          `${member.user.tag} joined using invite code ${invite.code} from ${inviter.tag}. Invite was used ${invite.uses} times since its creation.`
        );
      }
    }

    if (!inviter) {
      const infoChannel = member.guild.channels.cache.find(
        (channel) => channel.name === process.env.BOT_INFO_CHANNEL_NAME
      );
      if (infoChannel) {
        infoChannel.send(
          `${member.user.tag} joined but I couldn't find through which invite.`
        );
      }
    }
  });
};

module.exports = {
  trackInvites,
};
