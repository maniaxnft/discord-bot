require("dotenv-safe").config();

const initProject = require("./modules/initProject");
const initBot = require("./modules/initBot");
const initCommands = require("./modules/initCommands");
const twitter = require("./modules/twitter");
const updateServerStats = require("./modules/serverStats");
const verifyYourself = require("./modules/verifyYourself");
const updateRemainingWhitelist = require("./modules/whitelist");
const { trackInvites } = require("./modules/invite");

// const custom = require("./modules/custom");
// const trackTrades = require("./modules/track-trades");

const { sendErrorToLogChannel } = require("./utils");

const boot = async () => {
  let bot = undefined;
  try {
    await initProject();
    bot = await initBot();
    await trackInvites(bot);
    await initCommands(bot);
    await twitter(bot);
    verifyYourself(bot);
    updateServerStats(bot);
    updateRemainingWhitelist(bot);
    // trackTrades(bot);
    // custom(bot);
  } catch (e) {
    sendErrorToLogChannel(bot, "Error on boot", e);
    throw new Error(e);
  }
};

boot();
