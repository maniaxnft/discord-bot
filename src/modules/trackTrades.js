/* eslint-disable multiline-ternary */
const { default: axios } = require("axios");
const { MessageEmbed } = require("discord.js");
const { sendErrorToLogChannel, isValidHttpUrl } = require("../utils");

const trackTrades = (bot) => {
  const salesSentToDiscordChannel = [];

  setInterval(async () => {
    try {
      const res = await axios.get(
        `${process.env.MORALIS_NFT_URL}/${process.env.NFT_CONTRACT_ADDRESS}/transfers?chain=${process.env.NFT_CHAIN}&format=decimal&limit=50`,
        {
          headers: {
            "x-api-key": process.env.MORALIS_WEB3_API_KEY,
          },
        }
      );
      const transactions = res.data?.result;

      for (let i = 0; i < transactions.length; i++) {
        try {
          const tokenId = res.data?.result[i]?.token_id;
          const value = Number(res.data?.result[i]?.value);
          const transactionTime = new Date(
            res.data?.result[i]?.block_timestamp
          );
          const transHash = res.data?.result[i]?.transaction_hash;
          const transactionUrl = `${process.env.TRANSACTION_EXPLORER_URL}${transHash}`;

          if (
            tokenId &&
            value > 0 &&
            !salesSentToDiscordChannel.includes(transHash)
          ) {
            const metadata = await axios.get(
              `${process.env.MORALIS_NFT_URL}/${process.env.NFT_CONTRACT_ADDRESS}/${tokenId}?chain=${process.env.NFT_CHAIN}&format=decimal`,
              {
                headers: {
                  "x-api-key": process.env.MORALIS_WEB3_API_KEY,
                },
              }
            );
            const meta = JSON.parse(metadata?.data?.metadata);
            const imageUrl = meta?.image;
            const tradedValue =
              Number(res.data?.result[i]?.value) / Math.pow(10, 18);
            const buyer = res.data?.result[i]?.from_address;
            const seller = res.data?.result[i]?.to_address;
            const rarity = meta?.attributes
              ? meta.attributes[meta.attributes.length - 1]?.value
              : undefined;

            const tradesChannel = await bot?.channels?.cache?.get(
              process.env.DISCORD_TRADES_CHANNEL_ID
            );

            if (
              tradesChannel &&
              tradedValue > 0 &&
              isValidHttpUrl(imageUrl) &&
              rarity &&
              buyer &&
              seller &&
              transactionTime
            ) {
              const messageEmbed = new MessageEmbed()
                .setColor(`#${process.env.DISCORD_BOT_COLOR}`)
                .setTitle("Trade!")
                .setURL(transactionUrl)
                .setDescription(
                  `Traded for ${tradedValue} ${process.env.COIN_NAME}`
                )
                .addFields(
                  { name: "Buyer", value: buyer },
                  {
                    name: "Seller",
                    value: seller,
                  }
                )
                .addField("Rarity", rarity, true)
                .setImage(imageUrl)
                .setTimestamp(transactionTime);

              tradesChannel.send({ embeds: [messageEmbed] });
              salesSentToDiscordChannel.push(transHash);
            }
          }
        } catch (e) {
          sendErrorToLogChannel(bot, `error at getting trades`, e);
        }
      }
    } catch (e) {
      sendErrorToLogChannel(bot, `error at getting transactions of trades`, e);
    }
  }, 10000);
};

module.exports = trackTrades;
