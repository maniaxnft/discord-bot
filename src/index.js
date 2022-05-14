require("dotenv-safe").config();

// const custom = require("./modules/custom");
const initProject = require("./modules/initProject");
const initBot = require("./modules/initBot");
const initCommands = require("./modules/initCommands");
const listenTweets = require("./modules/listenTweets");
const updateServerStats = require("./modules/serverStats");
const trackTrades = require("./modules/track-trades");
const verifyYourself = require("./modules/verifyYourself");
const updateRemainingWhitelist = require("./modules/whitelist");

const { sendErrorToLogChannel } = require("./utils");

const boot = async () => {
  let bot = undefined;
  try {
    await initProject();
    bot = await initBot();
    // custom(bot);
    await initCommands(bot);
    await listenTweets(bot);
    verifyYourself(bot);
    updateServerStats(bot);
    trackTrades(bot);
    updateRemainingWhitelist(bot);
  } catch (e) {
    sendErrorToLogChannel(bot, "Error on boot", e);
    throw new Error(e);
  }
};

boot();
