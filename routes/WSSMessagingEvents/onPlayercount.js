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
        if (message.event == "playerCount") {
            global.verboseLog("playerCount event recieved with count: " + message.count)
            let count = message.count
            let server = message.server
            global.playerCount += count
            if(!global.wssConnectedPeers[server]){
                global.verboseLog("server not found in wssConnectedPeers, adding it to the list")
                global.wssConnectedPeers[server] = conn
                if(global.serverInfo[message.identifier]){
                    global.serverInfo[message.identifier].status = "online"
                    global.serverInfo[server].playersOnline = count

                }else{
                    global.serverInfo[message.identifier] = {
                        status: "online",
                        playersOnline: count
                    }
                }
            }
            global.discordMessager.setBotStatus(`${global.playerCount} players online`)
        }
    })
}