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
module.exports = (conn, req) => {
    conn.socket.on('close', () => {
        global.verboseLog("websocket connection closed")
        //check who closed the connection
        let closed 
        for (let i of Object.keys(global.wssConnectedPeers)){
            if(global.wssConnectedPeers[i] == conn){
                closed = i
            }
        }
        global.verboseLog("server closed: " + closed)
        //send a message to servers and global chat saying that the server has shut down
        if(global.serverInfo[closed]){
            global.serverInfo[closed].status = "unreachable"
        }else{
            global.serverInfo[closed] = {
                status: "unreachable"
            }
        }
        global.discordMessager.sendToGlobal(`[${closed}] Websocket has disconnected.`)
        global.discordMessager.sendToServer(closed, `Websocket has disconnected.`)
        //remove the server from the connected peers list
        delete global.wssConnectedPeers[closed]
    })
}