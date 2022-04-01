require("dotenv").config();

const init = require("./init");
const initCommands = require("./commands");
const listenTweets = require("./twitter");
// const { trackInvites } = require("./invite/inviteTracker");

const boot = async () => {
  await init();
  initCommands();
  listenTweets();
  // trackInvites();
};

boot();
