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
            global.verboseLog("message event recieved by: " + message.player + " on server: " + message.server + " in channel: " + message.channel + " with message: " + message.message + " and uuid: " + message.uuid)
            let server = message.server
            let player = message.player
            let content = message.message
            let uuid = message.uuid
            let channel = message.channel
            let userIcon = `https://crafatar.com/avatars/${uuid}`;
            //kick in the emergency identification system
            if(!global.wssConnectedPeers[server]){
                global.verboseLog("server not found in wssConnectedPeers, adding it to the list")
                global.wssConnectedPeers[server] = conn
            }
            global.discordMessager.sendToGlobal(`[${server}] <${channel}>: ${content}`, player, userIcon)
            global.discordMessager.sendToServer(server, `<${channel}>: ${content}`, player, userIcon)
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