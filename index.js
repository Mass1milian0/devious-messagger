require('dotenv').config()
require('./register-commands')
require('./router')
const fs = require('fs')
const {Client, Collection, Intents} = require("discord.js")
const client = new Client({
    intents: [Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES],
    partials: ['MESSAGE', 'CHANNEL']
});

//make a collection of commands in the client, scan for commands and for each commands that ends in .js add to the collection
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

//uncaught exception handler
process.on('uncaughtException', (err) => {
    console.log(err);
})

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.on("ready", async() => { 

    console.info("\nDevious Discord Bot Copyright (C) 2023 By:M1S0 \n (GNU GENERAL PUBLIC LICENSE)[Version 3, 29 June 2007] \n This program comes with ABSOLUTELY NO WARRANTY; \n This is free software, and you are welcome to do as you please under one condition, \n Proper credit be given by documenting our names for the work we have done. \n");
    console.info("Devious Integration Bot loaded Succesfully") //RIP "bot is ready to roll"
})

//User leaves discord, remove them from whitelist, DB, and kick them from server just incase they are on it

client.on('interactionCreate', async interaction => {
    //interaction executer and error handling
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName)
        if (!command) {
            console.error(interaction);
        }
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'Error executing this command!',
                ephemeral: true
            });
        }
    }
})

client.login(process.env.DISCORD_TOKEN)