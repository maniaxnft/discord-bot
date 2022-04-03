const Discord = require("discord.js");
const { wait } = require("../utils");

const moderate = () => {
  const bot = new Discord.Client({
    intents: [
      Discord.Intents.FLAGS.GUILDS,
      Discord.Intents.FLAGS.GUILD_MESSAGES,
      Discord.Intents.FLAGS.GUILD_MEMBERS,
      Discord.Intents.FLAGS.GUILD_PRESENCES,
    ],
  });
  bot.login(process.env.DISCORD_TOKEN);

  bot.on("ready", async () => {
    await wait(1000);
    console.log("Moderator bot is ready to use!");
  });

  bot.on("message", (message) => {
    if (
      message.guildId === process.env.DISCORD_COMMAND_ONLY_CHANNEL &&
      message.interaction?.type !== "APPLICATION_COMMAND"
    ) {
      message.delete(); // Deletes the message
    }
  });
};

module.exports = moderate;
