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
    conn.socket.on('message', (message) => {
        message = JSON.parse(message)
        if (message.event == "serverState") {
            global.verboseLog("serverState event recieved with server: " + message.server + " with state: " + message.state)
            let server = message.server
            let state = message.state
            let parsedState = state == "started" ? "online" : "offline"
            if(!global.wssConnectedPeers[server]){
                global.verboseLog("server not found in wssConnectedPeers, adding it to the list")
                global.wssConnectedPeers[server] = conn
                if(global.serverInfo[message.identifier]){
                    global.serverInfo[message.identifier].status = parsedState
                }else{
                    global.serverInfo[message.identifier] = {
                        status: parsedState
                    }
                }
            }
            let msg = state == "started" ? "has started" : "is stopping"
            global.discordMessager.sendToGlobal(`${server} ${msg}.`)
            global.discordMessager.sendToServer(server, `${server} ${msg}.`)
        }
    })
}