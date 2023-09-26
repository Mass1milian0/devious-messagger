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
            let server = message.server
            let player = message.player
            let state = message.state
            if(state == "joined"){
                global.discordMessager.sendToServer(server, `${player} joined the game.`)
                global.discordMessager.sendToGlobal(`[${server}] ${player} joined the game.`)
            }else {
                global.discordMessager.sendToServer(server, `${player} left the game.`)
                global.discordMessager.sendToGlobal(`[${server}] ${player} left the game.`)
            }
        }
    })
}