const Discord = require("discord.js");
const { wait } = require("../utils");

const initBot = async () => {
  const bot = new Discord.Client({
    intents: [
      Discord.Intents.FLAGS.GUILDS,
      Discord.Intents.FLAGS.GUILD_MESSAGES,
      Discord.Intents.FLAGS.GUILD_MEMBERS,
      Discord.Intents.FLAGS.GUILD_PRESENCES,
      Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
  });
  try {
    await bot.login(process.env.DISCORD_TOKEN);
    await wait(5000);
    console.log("Bot successfully logged in!");
    return bot;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = initBot;
