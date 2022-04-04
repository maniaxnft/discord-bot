require("dotenv").config();

const initProject = require("./initProject");
const initBot = require("./modules/initBot");
const initCommands = require("./modules/initCommands");
const listenTweets = require("./modules/listenTweets");
const showServerStats = require("./modules/serverStats");
const moderate = require("./modules/moderate");

const boot = async () => {
  try {
    await initProject();
    const bot = await initBot();
    await initCommands(bot);
    await listenTweets(bot);
    showServerStats(bot);
    moderate(bot);
  } catch (e) {
    throw new Error(e);
  }
};

boot();
