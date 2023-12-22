const {Client, Intents} = require("discord.js")
const DiscordMessager = require('./../classes/DiscordClass.js')
const database = require('./database.js')
let chatChannels = database.chatChannels.findAll()
const client = new Client({
    intents: [Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES],
    partials: ['MESSAGE', 'CHANNEL']
});

client.login(process.env.DISCORD_TOKEN)

const discordInstance = new DiscordMessager(client,chatChannels)

module.exports = {client, discordInstance}