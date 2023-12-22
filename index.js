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
const {client, discordInstance} = require('./services/discordInstance.js')
const verboseLog = require('./services/logger.js')
const database = require('./services/database.js')
const redis = require('./services/redisInstance.js')
const websocketManager = require('./services/websocketInstance.js')
const { json } = require('sequelize')

//uncaught exception handler
process.on('uncaughtException', (err) => {
    console.log(err);
})

//redis init
redis.on("ready", async () => {
    let data = await database.servers.findAll()
    data = data.map(server => server.dataValues)
    redis.set("servers", data)
})

client.on("ready", async() => { 
    require('./services/mockdataInserter')()
    require('./services/router.js')
    console.info("\nDevious Discord Messager Copyright (C) 2023 By:M1S0 \n (GNU GENERAL PUBLIC LICENSE)[Version 3, 29 June 2007] \n This program comes with ABSOLUTELY NO WARRANTY; \n This is free software, and you are welcome to do as you please under one condition, \n Proper credit be given by documenting our names for the work we have done. \n");
    console.info("Messager Bot loaded Succesfully") //RIP "bot is ready to roll"
    verboseLog("client on ready fired")
    discordInstance.setBotStatus(`0 players online`)
    verboseLog("discord messager created")
    let staff = await database.usersRank.findAll({
        include: [{
            model: database.ranks,
            where: {
                rank_name: "Staff"
            },
            //don't include ranks in the result
            attributes: []
        }],
        //only return user_uuid
        attributes: ["user_uuid"]
        
    })
    //log human readable staff
    staff = staff.map(staff => staff.dataValues.user_uuid)
    verboseLog("staff: " + staff)
    discordInstance.on("globalMessage", (message) => {
        websocketManager.sentToAll(JSON.stringify({
            event: "message",
            username: message.author.username,
            channel: "global",
            serverName: "Discord",
            message: message.content
        }))
        verboseLog("sent global message to all peers")
    })
    discordInstance.on("serverMessage", (message,server) => {
        verboseLog("received server message from discord by server: "+server)
        websocketManager.sendToServer(server, JSON.stringify({
            event: "message",
            username: message.author.username,
            channel: "server",
            serverName: "Discord",
            message: message.content
        }))
        //relay to global
        if(message.author.bot) return
        discordInstance.sendToGlobal(`[${server}] ${message.content}`, message.author.username, message.author.avatarURL())
        verboseLog("relayed server message to global")
    })
    discordInstance.on("globalStaffMessage", (message) => {
        verboseLog("received global staff message from discord")
        websocketManager.sentToAll(JSON.stringify({
            event: "message",
            username: "[STAFF] "+message.author.username,
            channel: "global",
            serverName: "Discord",
            message: message.content
        }))
        discordInstance.sentToAllServers(`[Announcement] ${message.content}`, message.author.username, message.author.avatarURL())
        discordInstance.sendToGlobal(`[Announcement] ${message.content}`, message.author.username, message.author.avatarURL())
    })
    discordInstance.on("ticketCreated", (channel) => {
        verboseLog("ticket created event recieved from discord")
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
        verboseLog("asking for player count")
        for(let peer of Object.values(global.wssConnectedPeers)){
            peer.socket.send(JSON.stringify({
                event: "playerCount"
            }))
        }
    }, 20*1000)
})