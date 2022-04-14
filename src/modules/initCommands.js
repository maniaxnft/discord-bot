const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const axios = require("axios");
const { getTop10Invites } = require("./trackInvites");
const { wait, sendErrorToLogChannel } = require("../utils");

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
      .setName("m-avax")
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
    sendErrorToLogChannel(e, "Error while registering commands");
  }
};

const listenCommands = (bot) => {
  bot.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;
    let isAdmin = interaction?.member?.roles?.cache?.map(
      (role) => role.name === process.env.DISCORD_ADMIN_ROLE_NAME
    );
    if (Array.isArray(isAdmin)) {
      isAdmin = isAdmin[0];
    }
    const { commandName } = interaction;

    if (commandName === "m-ping") {
      await interaction.reply(">>> Pong!");
    } else if (commandName === "m-server" && isAdmin === true) {
      await interaction.reply(
        `>>> Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
      );
    } else if (commandName === "m-invites") {
      const invites = await getTop10Invites(bot);
      await interaction.reply(leaderBoard(invites));
    } else if (commandName === "m-avax") {
      await wait(300);
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

const leaderBoard = (invites) => {
  let str =
    ">>>        **Leaderboard**\n \n **Name**                **Invited**\n";
  invites.map(({ username, uses }) => {
    str = `${str}${username}               ${uses}\n`;
  });

  return str;
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
