const axios = require("axios");
const cron = require("node-cron");

const { sendErrorToLogChannel } = require("../../utils");
const tweetModel = require("./model");

const index = (bot) => {
  cron.schedule("*/4 * * * *", () => {
    listenTweets(bot);
  });
};

const listenTweets = async (bot) => {
  try {
    const channel = await bot?.channels?.cache?.get(
      process.env.DISCORD_TWEETS_CHANNEL_ID
    );

    const fiveMins = 150 * 60000;

    const start_time = new Date(new Date().getTime() - fiveMins).toISOString();
    const end_time = new Date().toISOString();
    const query = `start_time=${start_time}&end_time=${end_time}&max_results=100&exclude=replies,retweets`;

    // https://developer.twitter.com/en/docs/twitter-api/tweets/timelines/api-reference/get-users-id-tweets
    const response = await axios.get(
      `https://api.twitter.com/2/users/${process.env.TWITTER_OFFICIAL_CHANNEL_ID}/tweets?${query}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
      }
    );
    const tweets = response.data?.data;
    if (response.data?.meta?.result_count === 0 || !Array.isArray(tweets)) {
      return;
    }

    for (const tweet of tweets) {
      const alreadySent = await tweetModel.findOne({
        tweetId: tweet.id,
      });
      if (!alreadySent) {
        channel.send(
          `https://twitter.com/${process.env.TWITTER_OFFICIAL_CHANNEL_NAME}/status/${tweet.id}`
        );
        await tweetModel.create({
          tweetId: tweet.id,
        });
      }
    }
  } catch (e) {
    sendErrorToLogChannel(bot, "Error at listenTweets", e);
  }
};

module.exports = index;
