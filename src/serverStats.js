const Discord = require("discord.js");
const { wait } = require("./utils");

const showServerStats = () => {
  const bot = new Discord.Client({
    intents: [
      Discord.Intents.FLAGS.GUILDS,
      Discord.Intents.FLAGS.GUILD_MESSAGES,
      Discord.Intents.FLAGS.GUILD_MEMBERS,
      Discord.Intents.FLAGS.GUILD_PRESENCES,
    ],
  });
  bot.login(process.env.DISCORD_TOKEN);
  bot.once("ready", () => {
    console.log("Server stats bot is ready to use!");
  });

  bot.on("guildMemberAdd", async (member) => {
    await wait(1000);
    updateStats(member, bot);
  });

  bot.on("guildMemberRemove", async (member) => {
    await wait(1000);
    updateStats(member, bot);
  });
};

const updateStats = async (member, bot) => {
  const memberCountChannel = await bot.channels.cache.get(
    process.env.DISCORD_MEMBER_COUNT_CHANNEL_ID
  );
  const botCountChannel = await bot.channels.cache.get(
    process.env.DISCORD_BOT_COUNT_CHANNEL_ID
  );
  const onlineUsersCountChannel = await bot.channels.cache.get(
    process.env.DISCORD_ONLINE_USERS_COUNT_CHANNEL_ID
  );

  const botCount = member.guild.members.cache.filter((m) => m.user.bot).size;

  memberCountChannel.setName(
    `🌍 | All Members: ${
      member.guild.members.cache.filter((m) => !m.user.bot).size
    }`
  );
  botCountChannel.setName(`🤖 | Bot Count: ${botCount}`);
  onlineUsersCountChannel.setName(
    `🟢 | Online Users: ${
      bot.guilds.cache
        .get(process.env.DISCORD_GUILD_ID)
        .members?.cache?.filter((m) => m.presence?.status === "online").size -
      botCount
    }`
  );
};

module.exports = showServerStats;
