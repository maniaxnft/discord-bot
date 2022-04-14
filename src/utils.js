const wait = require("timers/promises").setTimeout;

const sendErrorToLogChannel = async (bot, message, e) => {
  if (bot && message) {
    const channel = await bot.channels?.cache?.get(
      process.env.DISCORD_BOT_INFO_CHANNEL_ID
    );
    if (channel) {
      channel.send(`${message}: ${e?.message}`);
    }
  }
};

const isValidHttpUrl = (string) => {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
};

module.exports = {
  wait,
  sendErrorToLogChannel,
  isValidHttpUrl,
};
