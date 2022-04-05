const { wait } = require("../utils");

const moderate = (bot) => {
  bot.on("ready", () => {
    console.log("Moderator bot is ready to use!");
  });

  bot.on("messageCreate", async (message) => {
    await wait(300);
    const guild = await bot?.guilds?.fetch(process.env.DISCORD_GUILD_ID);
    const member = await guild?.members?.fetch(message.author.id);
    //const isAdmin = member?.roles?.cache?.has(
    // process.env.DISCORD_ADMIN_ROLE_ID
    // );

    if (
      message.channelId === process.env.DISCORD_COMMAND_ONLY_CHANNEL &&
      message.interaction?.type !== "APPLICATION_COMMAND"
    ) {
      message.delete();
    }
  });
};

module.exports = moderate;
