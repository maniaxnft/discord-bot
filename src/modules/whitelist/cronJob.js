const cron = require("node-cron");
const { sendErrorToLogChannel } = require("../../utils");
const { remainingWhitelistModel } = require("./models");

const cronJob = (bot) => {
  //run every 10 to 20 mins
  cron.schedule("10-20 * * * *", async () => {
    const whitelistCountChannel = await bot?.channels?.cache?.get(
      process.env.DISCORD_WHITELIST_INFO_CHANNEL_ID
    );
    const remaining = remainingWhitelistModel.findOne();
    if (remaining && whitelistCountChannel) {
      whitelistCountChannel.setName(`Whitelist: ${remaining.count} / 1300`);
    } else {
      sendErrorToLogChannel(
        bot,
        "remainingWhitelistModel or whitelistCountChannel is undefined"
      );
    }
  });
};

module.exports = cronJob;
