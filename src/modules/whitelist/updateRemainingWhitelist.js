const { sendErrorToLogChannel } = require("../../utils");
const cronJob = require("./cronJob");
const { remainingWhitelistModel } = require("./models");

const updateRemainingWhitelist = (bot) => {
  bot.on("messageCreate", async (message) => {
    try {
      let remainigModel = await remainingWhitelistModel.findOne();
      if (!remainigModel) {
        await remainingWhitelistModel.create({ count: 0 });
        remainigModel = await remainingWhitelistModel.findOne();
      }
      let count = remainigModel.count;
      if (message.channelId === process.env.DISCORD_GOLD_CHANNEL_ID) {
        count = count + 10;
      }
      if (message.channelId === process.env.DISCORD_SILVER_CHANNEL_ID) {
        count = count + 8;
      }
      if (message.channelId === process.env.DISCORD_BRONZ_CHANNEL_ID) {
        count = count + 6;
      }
      await remainingWhitelistModel.findByIdAndUpdate(
        remainigModel._id.toString(),
        { count }
      );
    } catch (e) {
      sendErrorToLogChannel(
        bot,
        "Error while updating remaining whitelist count",
        e
      );
    }
  });
  cronJob(bot);
};

module.exports = updateRemainingWhitelist;
