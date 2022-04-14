/* eslint-disable multiline-ternary */
const { default: axios } = require("axios");
const { MessageEmbed } = require("discord.js");

const trackTrades = (bot) => {
  setInterval(async () => {
    try {
      const date = new Date();
      const res = await axios.get(
        `${process.env.MORALIS_NFT_URL}/${process.env.NFT_CONTRACT_ADDRESS}/transfers?chain=${process.env.NFT_CHAIN}&format=decimal`,
        {
          headers: {
            "x-api-key": process.env.MORALIS_WEB3_API_KEY,
          },
        }
      );
      const transactions = res.data?.result;

      for (let i = 0; i < transactions.length; i++) {
        try {
          const diffInSeconds =
            (date.getTime() -
              new Date(res.data?.result[i]?.block_timestamp).getTime()) /
            1000;
          const tokenId = res.data?.result[i]?.token_id;
          const value = Number(res.data?.result[i]?.value);

          if (tokenId && value > 0 && diffInSeconds < 6.5) {
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

            const explorer = process.env.TRANSACTION_EXPLORER_URL;

            const transactionUrl = `${explorer}${res.data?.result[i]?.transaction_hash}`;
            // const nftAddress = res.data?.result[i]?.token_address;
            // const nftId = res.data?.result[i]?.token_id;
            const buyer = res.data?.result[i]?.from_address;
            const seller = res.data?.result[i]?.to_address;
            const rarity = meta?.attributes
              ? meta.attributes[meta.attributes.length - 1]?.value
              : undefined;

            const tradesChannel = await bot?.channels?.cache?.get(
              process.env.DISCORD_TRADES_CHANNEL_ID
            );
            if (!tradesChannel) {
              throw new Error("tradesChannel is undefined");
            }
            if (tradesChannel && tradedValue > 0) {
              const messageEmbed = new MessageEmbed()
                .setColor("#0099ff")
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
                .setTimestamp();

              tradesChannel.send({ embeds: [messageEmbed] });
            }
          }
        } catch (e) {
          console.log(e);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }, 5000);
};

module.exports = trackTrades;
