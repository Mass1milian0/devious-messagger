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
const verboseLog = require("./../services/logger.js")
const redisInstance = require("./../services/redisInstance.js")
const {client, discordInstance} = require("./../services/discordInstance.js")
module.exports = (conn, req) => {
    conn.socket.on('message', (message) => {
        message = JSON.parse(message)
        if (message.event == "message") {
            verboseLog("message event recieved by: " + message.player + " on server: " + message.server + " in channel: " + message.channel + " with message: " + message.message + " and uuid: " + message.uuid)
            let identifier = message.server
            let player = message.player
            let content = message.message
            let uuid = message.uuid
            let channel = message.channel
            let userIcon = `https://crafatar.com/avatars/${uuid}`;
            this.websocketManager.addPeer(identifier, conn)
            let server = redisInstance.get("servers").find(server => server.server_id == identifier)
            //update the server status or add it if it doesn't exist
            if(server){
                server.status = "online"
                redisInstance.set("servers", redisInstance.get("servers").map(server => server.server_id == identifier ? server : server))
                verboseLog("server status updated")
            }else{
                redisInstance.set("servers", [...redisInstance.get("servers"), {server_id: identifier, status: "online"}])
                verboseLog("server added")
            }
            discordInstance.sendToGlobal(`[${identifier}]: ${content}`, `${player} / ${channel}`, userIcon)
            discordInstance.sendToServer(identifier, `${content}`, `${player} / ${channel}`, userIcon)
            //send globally to all connected peers but the sender
            this.websocketManager.sentToAll(JSON.stringify({
                event: "message",
                username: player,
                channel: channel,
                serverName: identifier,
                message: content,
            }), true, identifier)
        }
    })
}