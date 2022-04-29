const { sendErrorToLogChannel } = require("../../utils");
const { remainingWhitelistModel } = require("./models");

const updateRemainingWhitelist = (bot) => {
  bot.on("messageCreate", async (message) => {
    await updateWhitelistStatus(message, 1);
  });

  bot.on("messageDelete", async (message) => {
    await updateWhitelistStatus(message, 0);
  });

  const updateWhitelistStatus = async (message, type) => {
    try {
      let remainigModel = await remainingWhitelistModel.findOne();
      if (!remainigModel) {
        await remainingWhitelistModel.create({ count: 0 });
        remainigModel = await remainingWhitelistModel.findOne();
      }
      let count = remainigModel.count;
      if (message.channelId === process.env.DISCORD_GOLD_CHANNEL_ID) {
        if (type === 1) {
          count += 10;
        }
        if (type === 0) {
          count -= 10;
        }
      }
      if (message.channelId === process.env.DISCORD_SILVER_CHANNEL_ID) {
        if (type === 1) {
          count += 8;
        }
        if (type === 0) {
          count -= 8;
        }
      }
      if (message.channelId === process.env.DISCORD_BRONZ_CHANNEL_ID) {
        if (type === 1) {
          count += 6;
        }
        if (type === 0) {
          count -= 6;
        }
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
  };
};

module.exports = updateRemainingWhitelist;
