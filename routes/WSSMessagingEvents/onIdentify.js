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
module.exports = async (conn, req) => {
    conn.socket.on('message', (message) => {
        message = JSON.parse(message)
        if(message.event == "identify"){
            verboseLog("identify event recieved by" + message.identifier)
            this.websocketManager.addPeer(message.identifier, conn)
            let server = redisInstance.get("servers").find(server => server.server_id == message.identifier)
            //update the server status or add it if it doesn't exist
            if(server){
                server.status = "online"
                redisInstance.set("servers", redisInstance.get("servers").map(server => server.server_id == message.identifier ? server : server))
                verboseLog("server status updated")
            }else{
                redisInstance.set("servers", [...redisInstance.get("servers"), {server_id: message.identifier, status: "online"}])
                verboseLog("server added")
            }
            //send a message to servers and global chat saying that the server has connected
            discordInstance.sendToGlobal(`[${message.identifier}] Websocket has connected.`)
            discordInstance.sendToServer(message.identifier, `Websocket has connected.`)
        }
    })
}