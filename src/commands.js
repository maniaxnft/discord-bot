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
      .setName("m-ping")
      .setDescription("Replies with pong!"),
    new SlashCommandBuilder()
      .setName("m-server")
      .setDescription("Replies with server info!"),
    new SlashCommandBuilder()
      .setName("m-invites")
      .setDescription("Shows top 10 inviters"),
  ].map((command) => command.toJSON());

  const rest = new REST({ version: "9" }).setToken(token);

  rest
    .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => console.log("Successfully registered application commands."))
    .catch(console.error);
};

const listenCommands = () => {
  const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  });
  client.login(process.env.DISCORD_TOKEN);
  client.once("ready", () => {
    console.log("Client is ready to use!");
  });

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;
    const isAdmin = interaction.member.roles.cache.map(
      (role) => role.name === process.env.ADMIN_ROLE_NAME
    );
    const { commandName } = interaction;
    if (commandName === "m-ping" && isAdmin) {
      await interaction.reply("Pong!");
    } else if (commandName === "m-server" && isAdmin) {
      await interaction.reply(
        `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
      );
    } else if (commandName === "m-invites" && isAdmin) {
      await interaction.reply("Going to show top 10 invites");
    } else {
      await interaction.reply("Resolver for this command does not found");
    }
  });
};

module.exports = {
  initCommands,
  listenCommands,
};
