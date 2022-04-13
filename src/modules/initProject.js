// const mongoose = require("mongoose");

const init = () => {
  try {
    checkEnvVars();
    // await connectToMongo();
  } catch (e) {
    throw new Error(e);
  }
};

/*const connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Successfully connected to mongodb!");
  } catch (e) {
    throw new Error(e);
  }
};*/

const checkEnvVars = () => {
  const envArray = [
    // process.env.MONGO_URL,
    process.env.DISCORD_TOKEN,
    process.env.DISCORD_CLIENT_ID,
    process.env.DISCORD_GUILD_ID,
    process.env.DISCORD_ADMIN_ROLE_NAME,
    process.env.DISCORD_ADMIN_ROLE_ID,
    process.env.DISCORD_TWEETS_CHANNEL_ID,
    process.env.DISCORD_INVITE_TRACKER_CHANNEL_ID,
    process.env.DISCORD_TRADES_CHANNEL_ID,
    process.env.COINGECKO_V3_API_URL,
    process.env.TWITTER_CONSUMER_KEY,
    process.env.TWITTER_CONSUMER_SECRET,
    process.env.TWITTER_BEARER_TOKEN,
    process.env.TWITTER_OFFICIAL_CHANNEL_NAME,
    process.env.DISCORD_MEMBER_COUNT_CHANNEL_ID,
    process.env.DISCORD_BOT_COUNT_CHANNEL_ID,
    process.env.DISCORD_ONLINE_USERS_COUNT_CHANNEL_ID,
    process.env.MORALIS_NFT_URL,
    process.env.MORALIS_WEB3_API_KEY,
    process.env.NFT_CONTRACT_ADDRESS,
    process.env.NFT_CHAIN,
    process.env.TRANSACTION_EXPLORER_URL,
    process.env.COIN_NAME,
  ];

  if (envArray.includes(undefined)) {
    console.error("Some of the env var(s) is(are) missing");
    process.exit(1);
  }
};

module.exports = init;
