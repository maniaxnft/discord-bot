const wait = require("timers/promises").setTimeout;

const sendErrorToLogChannel = async (bot, message, e) => {
  if (bot) {
    const channel = await bot.channels?.cache?.get(
      process.env.DISCORD_BOT_INFO_CHANNEL_ID
    );
    if (channel) {
      channel.send("Error on boot: ", e);
    }
  }
};

module.exports = {
  wait,
  sendErrorToLogChannel,
};
