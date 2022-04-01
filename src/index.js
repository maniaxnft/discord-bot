require("dotenv").config();

const initProject = require("./initProject");
const initCommands = require("./initCommands");
const listenTweets = require("./listenTweets");
// const { trackInvites } = require("./invite/inviteTracker");

const boot = async () => {
  try {
    await initProject();
    initCommands();
    listenTweets();
    // trackInvites();
  } catch (e) {
    throw new Error(e);
  }
};

boot();
