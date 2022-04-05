const { wait, sendErrorToLogChannel } = require("../utils");
const needle = require("needle");

const showServerStats = (bot) => {
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
  const memberCountChannel = await bot?.channels?.cache?.get(
    process.env.DISCORD_MEMBER_COUNT_CHANNEL_ID
  );
  const botCountChannel = await bot?.channels?.cache?.get(
    process.env.DISCORD_BOT_COUNT_CHANNEL_ID
  );
  const onlineUsersCountChannel = await bot?.channels?.cache?.get(
    process.env.DISCORD_ONLINE_USERS_COUNT_CHANNEL_ID
  );
  const twitterFollowerCountChannel = await bot?.channels?.cache?.get(
    process.env.DISCORD_TWITTER_FOLLOWER_COUNT_CHANNNEL_ID
  );

  let followerCount = undefined;
  try {
    followerCount = await getTwitterFollowerCount();
  } catch (e) {
    sendErrorToLogChannel(bot, "Error while getting twitter follower count", e);
    console.error(e);
  }
  const botCount = member.guild?.members?.cache?.filter((m) => m.user.bot).size;
  const onlineUsers =
    bot.guilds?.cache
      ?.get(process.env.DISCORD_GUILD_ID)
      .members?.cache?.filter((m) => m.presence?.status === "online").size -
    botCount;

  memberCountChannel.setName(
    `🌍 | Members: ${
      member.guild.members.cache.filter((m) => !m.user.bot).size - botCount
    }`
  );
  if (botCount && botCountChannel) {
    botCountChannel.setName(`🤖 | Bots: ${botCount}`);
  }
  if (onlineUsers && onlineUsersCountChannel) {
    onlineUsersCountChannel.setName(
      `🟢 | Online: ${
        bot.guilds.cache
          .get(process.env.DISCORD_GUILD_ID)
          .members?.cache?.filter((m) => m.presence?.status === "online").size -
        botCount
      }`
    );
  }
  if (followerCount && twitterFollowerCountChannel) {
    twitterFollowerCountChannel.setName(`🗝︱ Twitter: ${followerCount}`);
  }
};

const getTwitterFollowerCount = async () => {
  try {
    const response = await needle(
      "get",
      `https://cdn.syndication.twimg.com/widgets/followbutton/info.json?screen_names=${process.env.TWITTER_OFFICIAL_CHANNEL_NAME}`
    );
    if (response.statusCode !== 200) {
      console.log("Error:", response.statusMessage, `${response.statusCode}\n`);
      throw new Error(response.body);
    }
    return response?.body[0]?.followers_count;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = showServerStats;
