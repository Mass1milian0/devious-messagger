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
const fs = require('fs')
global.wssConnectedPeers = {}
const route = {
    method: 'GET',
    url: '/WSSMessaging',
    handler: (req, reply) => {
        reply.send({
            error: "This is a websocket route, please use a websocket client to connect to this route."
        })
    },
    wsHandler: (conn, req) => {
        global.verboseLog("websocket connection recieved")
        conn.setEncoding('utf8')
        conn.socket.send(JSON.stringify({
            event: "identify"
        }))
        global.verboseLog("identify event sent")
        fs.readdirSync(`./routes/WSSMessagingEvents`).forEach(event => {
            let eventHandle = require(`./WSSMessagingEvents/${event}`)
            if (Array.isArray(eventHandle)) {
                eventHandle.forEach(e => e(conn, req))
            } else {
                eventHandle(conn, req)
            }
        })
    }
}
module.exports = route