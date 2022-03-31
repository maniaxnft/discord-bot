const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { Client, Intents } = require("discord.js");

const initCommands = () => {
  const clientId = process.env.CLIENT_ID;
  const guildId = process.env.GUILD_ID;
  const token = process.env.DISCORD_TOKEN;

  const commands = [
    new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Replies with pong!"),
    new SlashCommandBuilder()
      .setName("server")
      .setDescription("Replies with server info!"),
    new SlashCommandBuilder()
      .setName("user")
      .setDescription("Replies with user info!"),
  ].map((command) => command.toJSON());

  const rest = new REST({ version: "9" }).setToken(token);

  rest
    .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => console.log("Successfully registered application commands."))
    .catch(console.error);
};

const listenCommands = () => {
  const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
  client.login(process.env.DISCORD_TOKEN);
  client.once("ready", () => {
    console.log("Client is ready to use!");
  });

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;
    console.log("interaction has been made!");
    const { commandName } = interaction;

    if (commandName === "ping") {
      await interaction.reply("Pong!");
    } else if (commandName === "server") {
      await interaction.reply("Server info.");
    } else if (commandName === "user") {
      await interaction.reply("User info.");
    }
  });
};

module.exports = {
  initCommands,
  listenCommands,
};
