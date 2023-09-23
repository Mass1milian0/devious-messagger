require('dotenv').config()
require('./router.js')
const fs = require('fs')
const {Client, Intents} = require("discord.js")
const DiscordMessager = require('./DiscordClass.js')
const client = new Client({
    intents: [Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES],
    partials: ['MESSAGE', 'CHANNEL']
});

//uncaught exception handler
process.on('uncaughtException', (err) => {
    console.log(err);
})

client.on("ready", async() => { 

    console.info("\nDevious Discord Messager Copyright (C) 2023 By:M1S0 \n (GNU GENERAL PUBLIC LICENSE)[Version 3, 29 June 2007] \n This program comes with ABSOLUTELY NO WARRANTY; \n This is free software, and you are welcome to do as you please under one condition, \n Proper credit be given by documenting our names for the work we have done. \n");
    console.info("Messager Bot loaded Succesfully") //RIP "bot is ready to roll"
    global.discordMessager = new DiscordMessager(client)
})

client.login(process.env.DISCORD_TOKEN)