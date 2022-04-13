require("dotenv").config();

const initProject = require("./modules/initProject");
const initBot = require("./modules/initBot");
const initCommands = require("./modules/initCommands");
const listenTweets = require("./modules/listenTweets");
const showServerStats = require("./modules/serverStats");
const moderate = require("./modules/moderate");
const trackTrades = require("./modules/trackTrades");

const { sendErrorToLogChannel } = require("./utils");

const boot = async () => {
  let bot = undefined;
  try {
    await initProject();
    bot = await initBot();
    await initCommands(bot);
    await listenTweets(bot);
    showServerStats(bot);
    moderate(bot);
    trackTrades(bot);
  } catch (e) {
    sendErrorToLogChannel(bot, "Error on boot: ", e);
    throw new Error(e);
  }
};

boot();
