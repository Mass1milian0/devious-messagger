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
        if (message.event == "serverState") {
            verboseLog("serverState event recieved with server: " + message.server + " with state: " + message.state)
            let identifier = message.server
            let state = message.state
            let parsedState = state == "started" ? "online" : "offline"
            this.websocketManager.addPeer(identifier, conn)
            let server = redisInstance.get("servers").find(server => server.server_id == identifier)
            //update the server status or add it if it doesn't exist
            if(server){
                server.status = parsedState
                redisInstance.set("servers", redisInstance.get("servers").map(server => server.server_id == identifier ? server : server))
                verboseLog("server status updated")
            }else{
                redisInstance.set("servers", [...redisInstance.get("servers"), {server_id: identifier, status: parsedState}])
                verboseLog("server added")
            }
            let msg = state == "started" ? "has started" : "is stopping"
            discordInstance.sendToGlobal(`${identifier} ${msg}.`)
            discordInstance.sendToServer(identifier, `${identifier} ${msg}.`)
        }
    })
}