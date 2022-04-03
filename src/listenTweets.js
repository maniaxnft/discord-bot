const Discord = require("discord.js");
const needle = require("needle");

const token = process.env.TWITTER_BEARER_TOKEN;
const rulesURL = "https://api.twitter.com/2/tweets/search/stream/rules";
const streamURL = "https://api.twitter.com/2/tweets/search/stream";

const rules = [
  {
    value: `from:${process.env.TWITTER_OFFICIAL_CHANNEL_NAME} -is:retweet`,
  },
];

const listenTweets = async () => {
  let currentRules;
  const bot = new Discord.Client({
    intents: [
      Discord.Intents.FLAGS.GUILDS,
      Discord.Intents.FLAGS.GUILD_MESSAGES,
      Discord.Intents.FLAGS.GUILD_MEMBERS,
      Discord.Intents.FLAGS.GUILD_PRESENCES,
    ],
  });
  bot.login(process.env.DISCORD_TOKEN);
  bot.once("ready", () => {
    console.log("Twitter bot is ready to use!");
  });
  const channel = await bot.channels.cache.get(
    process.env.DISCORD_BOT_INFO_CHANNEL_ID
  );

  try {
    currentRules = await getAllRules();
    await deleteAllRules(currentRules);
    await setRules(currentRules);
    streamConnect(bot, 0);
  } catch (e) {
    channel.send("Error while listening tweets: ", e);
    console.error(e);
  }
};

const streamConnect = (bot, retryAttempt) => {
  const stream = needle.get(streamURL, {
    headers: {
      "User-Agent": "v2FilterStreamJS",
      Authorization: `Bearer ${token}`,
    },
    timeout: 20000,
  });

  stream
    .on("data", async (data) => {
      try {
        const tweet = JSON.parse(data);
        await sendTweetToChannel(bot, tweet);
        // A successful connection resets retry count.
        retryAttempt = 0;
      } catch (e) {
        if (
          data.detail ===
          "This stream is currently at the maximum allowed connection limit."
        ) {
          console.log(data.detail);
        } else {
          // Keep alive signal received. Do nothing.
        }
      }
    })
    .on("err", (error) => {
      if (error.code !== "ECONNRESET") {
        console.log(error.code);
      } else {
        setTimeout(() => {
          console.warn("A connection error occurred. Reconnecting...");
          streamConnect(++retryAttempt);
        }, 2 ** retryAttempt);
      }
    });

  return stream;
};

const sendTweetToChannel = async (bot, tweet) => {
  const channel = await bot?.channels?.cache?.get(
    process.env.DISCORD_TWEETS_CHANNEL_ID
  );
  const tweetText = tweet?.data?.text;
  if (channel && tweetText && tweet?.data?.id) {
    const tweetURL = `https://twitter.com/${process.env.TWITTER_OFFICIAL_CHANNEL_NAME}/status/${tweet?.data?.id}`;
    channel.send(`${tweetURL}`);
  } else {
    console.log(
      "Channel undefined OR tweet is in wrong format or undefined \n"
    );
  }
};

const getAllRules = async () => {
  const response = await needle("get", rulesURL, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  if (response.statusCode !== 200) {
    console.log("Error:", response.statusMessage, `${response.statusCode}\n`);
    throw new Error(response.body);
  }
  return response.body;
};

const deleteAllRules = async (rules) => {
  if (!Array.isArray(rules.data)) {
    return null;
  }
  const ids = rules.data.map((rule) => rule.id);
  const data = {
    delete: {
      ids: ids,
    },
  };

  const response = await needle("post", rulesURL, data, {
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });

  if (response.statusCode !== 200) {
    throw new Error(response.body);
  }
  return response.body;
};

const setRules = async () => {
  const data = {
    add: rules,
  };
  const response = await needle("post", rulesURL, data, {
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });

  if (response.statusCode !== 201) {
    throw new Error(response.body);
  }
  return response.body;
};

module.exports = {
  listenTweets,
};
