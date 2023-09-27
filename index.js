/*
This file is part of Devious Messager.
 Copyright (C) 2023 M1S0

Devious Messager is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
  
*/
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
    global.discordMessager.setBotStatus(`0 players online`)
    global.discordMessager.on("globalMessage", (message) => {
        Object.values(global.wssConnectedPeers).forEach(peer => {
            console.log("sending message to peer")
            peer.socket.send(JSON.stringify({
                event: "message",
                username: message.author.username,
                channel: "global",
                serverName: "Discord",
                message: message.content
            }))
        })
    })
    global.discordMessager.on("serverMessage", (message,server) => {
        let serverSocket = global.wssConnectedPeers[server]
        if (serverSocket) {
            serverSocket.socket.send(JSON.stringify({
                event: "message",
                username: message.author.username,
                channel: "server",
                serverName: "Discord",
                message: message.content
            }))
        }
        //relay to global
        global.discordMessager.sendToGlobal(`[${server}] ${message.content}`, message.author.username, message.author.avatarURL())
    })

    setTimeout(() => {
        global.playerCount = 0 
        for(let peer of Object.values(global.wssConnectedPeers)){
            peer.socket.send(JSON.stringify({
                event: "playerCount"
            }))
        }
    }, 20*1000)
})

client.login(process.env.DISCORD_TOKEN)