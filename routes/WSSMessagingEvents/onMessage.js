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
        if (message.event == "message") {
            let server = message.server
            let player = message.player
            let content = message.message
            global.discordMessager.sendToGlobal(`[${server}] ${player}: ${content}`)
            global.discordMessager.sendToServer(server, `${player}: ${content}`)
            //send globally to all connected peers but the sender
            Object.values(global.wssConnectedPeers).forEach(peer => {
                if (peer.socket != conn.socket) {
                    peer.socket.send(JSON.stringify({
                        event: "message",
                        username: player,
                        channel: "global",
                        serverName: server,
                        message: content
                    }))
                }
            })
        }
    })
}