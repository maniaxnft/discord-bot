const mongoose = require("mongoose");

const init = async () => {
  checkEnvVars();
  try {
    await mongoose.connect(`mongodb://localhost:27017/${process.env.APP_NAME}`);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

const checkEnvVars = () => {
  const var1 = process.env.APP_NAME;
  const var2 = process.env.DISCORD_TOKEN;
  const var3 = process.env.DISCORD_OFFICIAL_TWEETS_CHANNEL_ID;
  const var4 = process.env.CLIENT_ID;
  const var5 = process.env.GUILD_ID;
  const var11 = process.env.COINGECKO_V3_API_URL;
  const var6 = process.env.ADMIN_ROLE_NAME;
  const var7 = process.env.BOT_INFO_CHANNEL_NAME;
  const var8 = process.env.INVITE_TRACKER_CHANNEL_NAME;
  const var9 = process.env.TWITTER_CONSUMER_KEY;
  const var10 = process.env.TWITTER_CONSUMER_SECRET;
  if (
    !var1 ||
    !var2 ||
    !var3 ||
    !var4 ||
    !var5 ||
    !var6 ||
    !var7 ||
    !var8 ||
    !var9 ||
    !var10 ||
    !var11
  ) {
    console.log("Some of the env var(s) is(are) missing");
    process.exit(1);
  }
};

module.exports = {
  init,
};
