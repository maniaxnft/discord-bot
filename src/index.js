require('dotenv').config()

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)

  // send private message
  client.users.fetch(process.env.TEST_USERID).then((user) => { 
    user.send('private message!');
   });
})

client.on("message", msg => {
  if (msg.content === "ping") {
    msg.reply("pong");
  }
})

client.login(process.env.TOKEN)
