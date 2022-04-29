const needle = require("needle");
const cron = require("node-cron");

const { sendErrorToLogChannel } = require("../utils");

const showServerStats = (bot) => {
  //run every .. mins
  cron.schedule("*/30 * * * *", () => {
    updateMemberCount(bot);
  });
  cron.schedule("*/60 * * * *", () => {
    updateOnlineCount(bot);
  });
  cron.schedule("*/90 * * * *", () => {
    updateTwitterCount(bot);
  });
};

const updateMemberCount = async (bot) => {
  const guild = await bot?.guilds?.fetch(process.env.DISCORD_GUILD_ID);

  const memberCountChannel = await bot?.channels?.cache?.get(
    process.env.DISCORD_MEMBER_COUNT_CHANNEL_ID
  );
  const botCountChannel = await bot?.channels?.cache?.get(
    process.env.DISCORD_BOT_COUNT_CHANNEL_ID
  );

  const botCount = guild?.members?.cache?.filter((m) => m.user.bot).size;
  const memberCount = guild?.members?.cache?.filter((m) => !m.user.bot).size;

  const memberCountChannelName = `🌍 | Members: ${memberCount}`;
  const botCountChannelName = `🤖 | Bots: ${botCount}`;
  if (
    memberCount &&
    memberCountChannel &&
    memberCountChannel.name !== memberCountChannelName
  ) {
    memberCountChannel.setName(memberCountChannelName);
  }

  if (
    botCount &&
    botCountChannel &&
    botCountChannel.name !== botCountChannelName
  ) {
    botCountChannel.setName(botCountChannelName);
  }
};

const updateOnlineCount = async (bot) => {
  const onlineUsers = bot.guilds?.cache
    ?.get(process.env.DISCORD_GUILD_ID)
    .members?.cache?.filter(
      (m) => m.presence?.status === "online" && !m.user.bot
    ).size;

  const onlineUsersCountChannel = await bot?.channels?.cache?.get(
    process.env.DISCORD_ONLINE_USERS_COUNT_CHANNEL_ID
  );
  const onlineUsersCountChannelName = `🟢 | Online: ${onlineUsers}`;
  if (
    onlineUsers &&
    onlineUsersCountChannel &&
    onlineUsersCountChannel.name !== onlineUsersCountChannelName
  ) {
    onlineUsersCountChannel.setName(onlineUsersCountChannelName);
  }
};

const updateTwitterCount = async (bot) => {
  let followerCount = undefined;
  const twitterFollowerCountChannel = await bot?.channels?.cache?.get(
    process.env.DISCORD_TWITTER_FOLLOWER_COUNT_CHANNNEL_ID
  );
  const twitterFollowerCountChannelName = `🐦︱ Twitter: ${followerCount}`;
  try {
    followerCount = await getTwitterFollowerCount(bot);
    if (
      followerCount &&
      twitterFollowerCountChannel &&
      twitterFollowerCountChannel.name !== twitterFollowerCountChannelName
    ) {
      twitterFollowerCountChannel.setName(twitterFollowerCountChannelName);
    }
  } catch (e) {
    sendErrorToLogChannel(bot, "Error while getting twitter follower count", e);
    console.error(e);
  }
};

const getTwitterFollowerCount = async (bot) => {
  try {
    const response = await needle(
      "get",
      `https://cdn.syndication.twimg.com/widgets/followbutton/info.json?screen_names=${process.env.TWITTER_OFFICIAL_CHANNEL_NAME}`
    );
    if (response.statusCode !== 200) {
      sendErrorToLogChannel(
        bot,
        `Error at getTwitterFollowerCount, ${response.statusMessage}`
      );
    }
    return response?.body[0]?.followers_count;
  } catch (e) {
    sendErrorToLogChannel(bot, `Error at getTwitterFollowerCount`, e);
  }
};

module.exports = showServerStats;
