const { Client, Intents } = require("discord.js");
const { inviteModel } = require("./inviteRepository");

const trackInvites = () => {
  const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  });

  client.login(process.env.DISCORD_TOKEN);

  // A pretty useful method to create a delay without blocking the whole script.
  const wait = require("timers/promises").setTimeout;

  client.on("ready", async () => {
    // "ready" isn't really ready. We need to wait a spell.
    await wait(1000);

    // Loop over all the guilds
    client.guilds.cache.forEach(async (guild) => {
      // Fetch all Guild Invites
      const firstInvites = await guild?.invites?.fetch();
      // Set the key as Guild ID, and create a map which has the invite code, and the number of uses
      if (Array.isArray(firstInvites)) {
        firstInvites.map((invite) => {
          inviteModel.findOneAndUpdate(
            { code: invite.code },
            {
              guildId: guild.id,
              code: invite.code,
              inviteCount: invite.uses,
            },
            { upsert: true }
          );
        });
      }
    });
  });
  client.on("inviteDelete", async (invite) => {
    // Delete the Invite from Cache
    await inviteModel.findOneAndRemove({
      guildId: invite.guild.id,
      code: invite.code,
    });
  });

  client.on("inviteCreate", async (invite) => {
    await inviteModel.create({
      guildId: guild.id,
      code: invite.code,
      inviteCount: invite.uses,
    });
  });
  client.on("guildCreate", (guild) => {
    // We've been added to a new Guild. Let's fetch all the invites, and save it to our cache
    guild?.invites?.fetch().then((guildInvites) => {
      // This is the same as the ready event
      if (Array.isArray(guildInvites)) {
        guildInvites.map((invite) => {
          inviteModel.create({
            guildId: guild.id,
            code: invite.code,
            inviteCount: invite.uses,
          });
        });
      }
    });
  });

  client.on("guildDelete", (guild) => {
    // We've been removed from a Guild. Let's delete all their invites
    inviteModel.findOneAndRemove({
      guildId: guild.id,
    });
  });

  client.on("guildMemberAdd", async (member) => {
    // To compare, we need to load the current invite list.
    const newInvites = await member.guild.invites.fetch();
    // This is the *existing* invites for the guild.
    const oldInvites = await inviteModel.find({
      guildId: member.guild.id,
    });
    // Look through the invites, find the one for which the uses went up.
    const invite = newInvites.find(
      (i) => i.inviteCount > oldInvites.get(i.code)
    );
    // This is just to simplify the message being sent below (inviter doesn't have a tag property)
    const inviter = await client.users.fetch(invite.inviter.id);
    // Get the log channel (change to your liking)
    const logChannel = member.guild.channels.cache.find(
      (channel) => channel.name === "invite-tracker"
    );
    // A real basic message with the information we need.
    inviter
      ? logChannel.send(
          `${member.user.tag} joined using invite code ${invite.code} from ${inviter.tag}. Invite was used ${invite.uses} times since its creation.`
        )
      : logChannel.send(
          `${member.user.tag} joined but I couldn't find through which invite.`
        );
  });
};

module.exports = {
  trackInvites,
};
