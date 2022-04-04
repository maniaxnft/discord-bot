const Discord = require("discord.js");

const initBot = async () => {
  const bot = new Discord.Client({
    intents: [
      Discord.Intents.FLAGS.GUILDS,
      Discord.Intents.FLAGS.GUILD_MESSAGES,
      Discord.Intents.FLAGS.GUILD_MEMBERS,
      Discord.Intents.FLAGS.GUILD_PRESENCES,
    ],
  });
  try {
    await bot.login(process.env.DISCORD_TOKEN);
    console.log("Bot successfully logged in!");
    return bot;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = initBot;
