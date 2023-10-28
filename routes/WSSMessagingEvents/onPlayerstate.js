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
        if (message.event == "playerState") {
            global.verboseLog("playerState event recieved with player: " + message.player + " on server: " + message.server + " with state: " + message.joined + " and uuid: " + message.uuid)
            let server = message.server
            let player = message.player
            let state = message.joined
            let uuid = message.uuid
            let userIcon = `https://crafatar.com/avatars/${uuid}`;
            if(!global.wssConnectedPeers[server]){
                global.verboseLog("server not found in wssConnectedPeers, adding it to the list")
                global.wssConnectedPeers[server] = conn
            }
            global.playerCount = 0
            Object.values(global.wssConnectedPeers).forEach(peer => {
                peer.socket.send(JSON.stringify({
                    event: "playerCount"
                }))
            })
            if(state == "joined"){
                global.discordMessager.sendToServer(server, `${player} joined the game.`, player, userIcon)
                global.discordMessager.sendToGlobal(`[${server}] ${player} joined the game.`, player, userIcon)
            }else {
                global.discordMessager.sendToServer(server, `${player} left the game.`, player, userIcon)
                global.discordMessager.sendToGlobal(`[${server}] ${player} left the game.`, player, userIcon)
            }
        }
    })
}