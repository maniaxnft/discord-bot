/* eslint-disable multiline-ternary */
const needle = require("needle");

const { sendErrorToLogChannel, wait } = require("../utils");
const { remainingWhitelistModel } = require("./whitelist/models");

const updateServerStats = async (bot) => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // https://stackoverflow.com/a/62792412/3756237
    await updateWhitelistCount(bot);
    await wait(300001);

    await updateMemberCount(bot);
    await wait(300001);

    await updateOnlineCount(bot);
    await wait(300001);

    await updateTwitterCount(bot);
    await wait(300001);
  }
};

const updateWhitelistCount = async (bot) => {
  try {
    const whitelistCountChannel = await bot?.channels?.cache?.get(
      process.env.DISCORD_WHITELIST_INFO_CHANNEL_ID
    );
    const remaining = await remainingWhitelistModel.findOne();
    const whitelistCountChannelName = `Whitelist: ${remaining.count} / 1300`;
    if (remaining && whitelistCountChannel.name !== whitelistCountChannelName) {
      whitelistCountChannel.setName(whitelistCountChannelName);
    }
  } catch (e) {
    sendErrorToLogChannel(bot, "Error at updateWhitelistCount", e);
  }
};

const updateMemberCount = async (bot) => {
  try {
    const guild = await bot?.guilds?.fetch(process.env.DISCORD_GUILD_ID);

    const memberCountChannel = await bot?.channels?.cache?.get(
      process.env.DISCORD_MEMBER_COUNT_CHANNEL_ID
    );

    const memberCount = guild?.members?.cache?.filter((m) => !m.user.bot).size;

    const memberCountChannelName = `🌍 | Members: ${memberCount}`;
    if (
      memberCount &&
      memberCountChannel &&
      memberCountChannel.name !== memberCountChannelName
    ) {
      memberCountChannel.setName(memberCountChannelName);
    }
  } catch (e) {
    sendErrorToLogChannel(bot, "Error at updateOnlineCount", e);
  }
};

const updateOnlineCount = async (bot) => {
  try {
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
  } catch (e) {
    sendErrorToLogChannel(bot, "Error at updateOnlineCount", e);
  }
};

const updateTwitterCount = async (bot) => {
  try {
    let followerCount = undefined;
    const twitterFollowerCountChannel = await bot?.channels?.cache?.get(
      process.env.DISCORD_TWITTER_FOLLOWER_COUNT_CHANNNEL_ID
    );
    followerCount = await getTwitterFollowerCount(bot);
    const twitterFollowerCountChannelName = `🐦︱ Twitter: ${followerCount}`;
    if (
      followerCount &&
      twitterFollowerCountChannel &&
      twitterFollowerCountChannel.name !== twitterFollowerCountChannelName
    ) {
      twitterFollowerCountChannel.setName(twitterFollowerCountChannelName);
    }
  } catch (e) {
    sendErrorToLogChannel(bot, "Error at updateTwitterCount", e);
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

module.exports = updateServerStats;
