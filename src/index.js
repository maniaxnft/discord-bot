require("dotenv").config();

const { init } = require("./init");
const { initCommands, listenCommands } = require("./commands");
const { trackInvites } = require("./invite/inviteTracker");
// const { listenTweets } = require("./twitter");

const boot = async () => {
  await init();
  initCommands();
  listenCommands();
  // trackInvites();
  // listenTweets();
};

boot();
