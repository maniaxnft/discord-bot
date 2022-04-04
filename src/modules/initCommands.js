const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const Discord = require("discord.js");
const axios = require("axios");
const getTop10Invites = require("./invite/getTop10invites");

const initCommands = async (bot) => {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const guildId = process.env.DISCORD_GUILD_ID;
  const token = process.env.DISCORD_TOKEN;

  const commands = [
    new SlashCommandBuilder()
      .setName("m-ping")
      .setDescription("Replies with pong!"),
    new SlashCommandBuilder()
      .setName("m-server")
      .setDescription("Replies with server info!"),
    new SlashCommandBuilder()
      .setName("m-invites")
      .setDescription("Shows top 10 inviters"),
    new SlashCommandBuilder()
      .setName("avaxprice")
      .setDescription("Shows current AVAX price"),
  ].map((command) => command.toJSON());

  const rest = new REST({ version: "9" }).setToken(token);

  try {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });
    console.log("Successfully registered application commands.");
    listenCommands(bot);
  } catch (e) {
    throw new Error(e);
  }
};

const listenCommands = (bot) => {
  bot.once("ready", () => {
    console.log("Command bot is ready to use!");
  });

  bot.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;
    const isAdmin = interaction?.member?.roles?.cache?.map(
      (role) => role.name === process.env.DISCORD_ADMIN_ROLE_NAME
    );

    const { commandName } = interaction;
    if (commandName === "m-ping" && isAdmin) {
      await interaction.reply(">>> Pong!");
    } else if (commandName === "m-server" && isAdmin) {
      await interaction.reply(
        `>>> Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
      );
    } else if (commandName === "m-invites" && isAdmin) {
      const invites = await getTop10Invites(interaction.guild?.id);
      await interaction.reply(`>>> ${JSON.stringify(invites, null, 2)}`);
    } else if (commandName === "avaxprice") {
      const price = await getAvaxPrice();
      if (price) {
        await interaction.reply(`>>> ${price}`);
      } else {
        await interaction.reply(">>> Can't get price for now.");
      }
    } else {
      await interaction.reply(">>> Resolver for this command does not found");
    }
  });
};

const getAvaxPrice = async () => {
  try {
    const response = await axios({
      url: `${process.env.COINGECKO_V3_API_URL}/simple/price?ids=avalanche-2&vs_currencies=usd`,
      method: "get",
    });
    if (response?.data?.["avalanche-2"]?.usd) {
      return response?.data?.["avalanche-2"]?.usd.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
};

module.exports = initCommands;
