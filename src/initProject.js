const mongoose = require("mongoose");

const init = async () => {
  try {
    checkEnvVars();
    await connectToMongo();
  } catch (e) {
    throw new Error(e);
  }
};

const connectToMongo = async () => {
  try {
    await mongoose.connect(`mongodb://localhost:27017/${process.env.APP_NAME}`);
    console.log("Successfully connected to mongodb!");
  } catch (e) {
    throw new Error(e);
  }
};

const checkEnvVars = () => {
  const var1 = process.env.APP_NAME;
  const var2 = process.env.DISCORD_TOKEN;
  const var4 = process.env.DISCORD_CLIENT_ID;
  const var5 = process.env.DISCORD_GUILD_ID;
  const var3 = process.env.DISCORD_TWEETS_CHANNEL_ID;
  const var6 = process.env.DISCORD_ADMIN_ROLE_NAME;
  const var7 = process.env.DISCORD_BOT_INFO_CHANNEL_NAME;
  const varr7 = process.env.DISCORD_BOT_INFO_CHANNEL_ID;
  const var8 = process.env.DISCORD_INVITE_TRACKER_CHANNEL_NAME;
  const var9 = process.env.TWITTER_CONSUMER_KEY;
  const var10 = process.env.TWITTER_CONSUMER_SECRET;
  const var11 = process.env.COINGECKO_V3_API_URL;
  const var12 = process.env.TWITTER_OFFICIAL_CHANNEL_NAME;
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
    !varr7 ||
    !var12 ||
    !var11
  ) {
    console.log("Some of the env var(s) is(are) missing");
    process.exit(1);
  }
};

module.exports = init;
