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
const fs = require('fs')
global.environment = process.env.NODE_ENV || "development"
global.serverInfo = {};
global.serverMap = JSON.parse(fs.readFileSync("./serverMap.json"))
global.verboseLog = (message) => {
    function writeToLogs(message,fs){
        let date = new Date()
        if (!fs.existsSync('./logs')) {
            fs.mkdirSync('./logs');
        }
        fs.appendFileSync("./logs/verbose.log", `[${date.toLocaleString()}] - ${message} \n`)
    }
    if(global.environment == "development"){        
        console.log(message)
        //write to log file
        //create logs folder if it doesnt exist
        if(!fs){
            fs = require('fs')
            writeToLogs(message,fs)
        }else{
            writeToLogs(message,fs)
        }
    }
}
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
    global.verboseLog("client on ready fired")
    global.discordMessager = new DiscordMessager(client)
    require('./router.js')
    global.discordMessager.setBotStatus(`0 players online`)
    global.verboseLog("discord messager created")
    global.discordMessager.on("globalMessage", (message) => {
        global.verboseLog("received global message from discord")
        Object.values(global.wssConnectedPeers).forEach(peer => {
            peer.socket.send(JSON.stringify({
                event: "message",
                username: message.author.username,
                channel: "global",
                serverName: "Discord",
                message: message.content
            }))
        })
        global.verboseLog("sent global message to all peers")
    })
    global.discordMessager.on("serverMessage", (message,server) => {
        global.verboseLog("received server message from discord by server: "+server)
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
        if(message.author.bot) return
        global.discordMessager.sendToGlobal(`[${server}] ${message.content}`, message.author.username, message.author.avatarURL())
        global.verboseLog("relayed server message to global")
    })
    global.discordMessager.on("globalStaffMessage", (message) => {
        global.verboseLog("received global staff message from discord")
        Object.values(global.wssConnectedPeers).forEach(peer => {
            peer.socket.send(JSON.stringify({
                event: "message",
                username: "[STAFF] "+message.author.username,
                channel: "server",
                serverName: "Announcement",
                message: message.content
            }))
        })
        for (let key of Object.keys(global.wssConnectedPeers)) {
            global.discordMessager.sendToServer(key, `[Announcement] ${message.content}`, message.author.username, message.author.avatarURL())
        }
        global.discordMessager.sendToGlobal(`[Announcement] ${message.content}`, message.author.username, message.author.avatarURL())
    })
    global.discordMessager.on("ticketCreated", (channel) => {
        global.verboseLog("ticket created event recieved from discord")
        let names = fs.readFileSync("./staffMap.json")
        names = JSON.parse(names)
        let staff = names.map(name => name.name) ///this returns: ["name1","name2","name3"]
        Object.values(global.wssConnectedPeers).forEach(peer => {
            peer.socket.send(JSON.stringify({
                event: "ticket",
                names: staff,
                message: "Ticket created: " + channel.name
            }))
        })
    })
    setTimeout(() => {
        global.playerCount = 0 
        global.verboseLog("asking for player count")
        for(let peer of Object.values(global.wssConnectedPeers)){
            peer.socket.send(JSON.stringify({
                event: "playerCount"
            }))
        }
    }, 20*1000)
})

client.login(process.env.DISCORD_TOKEN)