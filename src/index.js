require("dotenv").config();
const { initCommands, listenCommands } = require("./commands");
const { init } = require("./init");
const { trackInvites } = require("./invite/inviteTracker");
const { listenTweets } = require("./twitter");

const boot = () => {
  init();
  initCommands();
  listenCommands();
  // trackInvites();
  // listenTweets();
};

boot();
