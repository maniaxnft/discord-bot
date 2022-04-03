require("dotenv").config();

const initProject = require("./initProject");
const initCommands = require("./initCommands");
const listenTweets = require("./listenTweets");
const trackInvites = require("./invite/trackInvites");
const showServerStats = require("./serverStats");

const boot = async () => {
  try {
    await initProject();
    await initCommands();
    await listenTweets();
    showServerStats();
    trackInvites();
  } catch (e) {
    throw new Error(e);
  }
};

boot();
