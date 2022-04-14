/* eslint-disable no-useless-return */
const { sendErrorToLogChannel, wait } = require("../utils");
const { MessageEmbed } = require("discord.js");

const verifyYourself = async (bot) => {
  await wait(3000);
  try {
    const channel = await bot?.channels?.cache?.get(
      process.env.DISCORD_VERIFY_HUMANITY_CHANNEL_ID
    );
    const verifyEmoji = "✅";
    const guild = await bot.guilds?.fetch(process.env.DISCORD_GUILD_ID);
    const verifiedRole = guild.roles.cache.find(
      (r) => r.id === `${process.env.DISCORD_VERIFIED_ROLE_ID}`
    );

    const messages = await channel.messages?.fetch({ limit: 1 });
    const lastMessage = messages.first();
    if (!lastMessage?.author?.bot) {
      const messageEmbed = new MessageEmbed()
        .setColor(`#${process.env.DISCORD_BOT_COLOR}`)
        .setDescription(
          `Welcome to the ${guild?.name}! React with ${verifyEmoji} to take the Verified role`
        );
      const veridyMessage = await channel.send({ embeds: [messageEmbed] });
      veridyMessage.react(verifyEmoji);
    }

    bot.on("messageReactionAdd", async (reaction, user) => {
      if (reaction.message?.partial) await reaction.message?.fetch();
      if (reaction.partial) await reaction.fetch();
      if (user.bot) return;
      if (!reaction.message?.guild) return;

      if (
        reaction.message?.channel?.id ===
          process.env.DISCORD_VERIFY_HUMANITY_CHANNEL_ID &&
        reaction.emoji?.name === verifyEmoji
      ) {
        try {
          await reaction.message?.guild?.members?.cache
            ?.get(user.id)
            ?.roles?.add(verifiedRole);
        } catch (e) {
          sendErrorToLogChannel(
            bot,
            "Error while giving verified role to user",
            e
          );
        }
      }
    });
  } catch (e) {
    sendErrorToLogChannel(bot, "verifyYourself error", e);
  }
};

module.exports = verifyYourself;