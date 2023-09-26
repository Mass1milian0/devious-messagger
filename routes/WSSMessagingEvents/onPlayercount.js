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
            let count = message.count
            if(!global.playerCount){
                global.playerCount = count
            }else {
                if(count > global.playerCount){
                    //if the count is higher than the current count, we add the difference
                    global.playerCount += count
                }else{
                    //if the count is lower than the current count, we subtract the difference
                    global.playerCount -= count
                }
            }
            if(global.playerCount < 0) global.playerCount = 0 //just in case
            global.discordMessager.setBotStatus(`${global.playerCount} players online`)
        }
    })
}