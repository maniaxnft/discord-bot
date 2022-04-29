const cron = require("node-cron");
const { sendErrorToLogChannel } = require("../../utils");
const { remainingWhitelistModel } = require("./models");

const cronJob = (bot) => {
  //run every 10 mins
  cron.schedule("*/10 * * * *", async () => {
    try {
      const whitelistCountChannel = await bot?.channels?.cache?.get(
        process.env.DISCORD_WHITELIST_INFO_CHANNEL_ID
      );
      const remaining = await remainingWhitelistModel.findOne();
      const whitelistCountChannelName = `Whitelist: ${remaining.count} / 1300`;
      if (
        remaining &&
        whitelistCountChannel.name !== whitelistCountChannelName
      ) {
        whitelistCountChannel.setName(whitelistCountChannelName);
      }
    } catch (e) {
      sendErrorToLogChannel(bot, "Error on cron job", e);
    }
  });
};

module.exports = cronJob;
