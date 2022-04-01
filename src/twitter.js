const Twit = require("twit");
const Discord = require("discord.js");

const listenTweets = () => {
  /*
  const client = new Discord.Client({
    intents: [
      Discord.Intents.FLAGS.GUILDS,
      Discord.Intents.FLAGS.GUILD_MESSAGES,
    ],
  });
  const T = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000,
    strictSSL: true,
  });
  client.login(process.env.DISCORD_TOKEN);
  client.once("ready", () => {
    const stream = T.stream("statuses/filter", {
      follow: [process.env.TWITTER_USER_ID],
    });

    stream.on("tweet", function (tweet) {
      //only show owner tweets
      if (tweet.user.id == process.env.TWITTER_USER_ID) {
        const url =
          "https://twitter.com/" +
          tweet.user.screen_name +
          "/status/" +
          tweet.id_str;
        try {
          let channel = client.channels
            .fetch(process.env.DISCORD_OFFICIAL_TWEETS_CHANNEL_ID)
            .then((channel) => {
              channel.send(url);
            })
            .catch((err) => {
              console.log(err);
            });
        } catch (error) {
          console.error(error);
        }
      }
    });
  });*/
};

module.exports = {
  listenTweets,
};
