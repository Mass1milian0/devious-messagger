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
require('dotenv').config();
const verboseLog = require('../../services/logger')
const redisInstance = require('../../services/redisInstance')
const {client, discordInstance} = require('../../services/discordInstance')
const websocketManager = require('../../services/websocketInstance')
module.exports = (conn, req) => {
    conn.socket.on('close', async() => {
        verboseLog("websocket connection closed")
        //check who closed the connection
        let closed 
        let peers = websocketManager.getAllPeers()
        for (let i of Object.keys(peers)){
            if(peers[i] == conn){
                closed = i
            }
        }
        let server = await redisInstance.get("servers")
        server = server.find(server => server.server_id == closed)
        //update the server status or add it if it doesn't exist
        if(server){
            server.status = "unreachable"
            redisInstance.set("servers", redisInstance.get("servers").map(server => server.server_id == message.identifier ? server : server))
            verboseLog("server status updated")
        }
        websocketManager.removePeer(closed)
        //send a message to servers and global chat saying that the server has disconnected
        discordInstance.sendToGlobal(`[${closed}] Websocket has disconnected.`)
        discordInstance.sendToServer(closed, `Websocket has disconnected.`)
    })
}