require("dotenv").config();

const initProject = require("./initProject");
const initCommands = require("./modules/initCommands");
const listenTweets = require("./modules/listenTweets");
const trackInvites = require("./modules/invite/trackInvites");
const showServerStats = require("./modules/serverStats");
const moderate = require("./modules/moderate");

const boot = async () => {
  try {
    await initProject();
    await initCommands();
    await listenTweets();
    showServerStats();
    trackInvites();
    moderate();
  } catch (e) {
    throw new Error(e);
  }
};

boot();
