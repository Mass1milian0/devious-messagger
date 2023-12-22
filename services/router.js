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
const port = process.env.PORT || 8080
const fastify = require('fastify')()
const websocketManager = require('./../services/websocketInstance.js')
fastify.register(require('fastify-static'), {
    root: `${__dirname}//public`,
    prefix: '/', // optional: default '/'

})
fastify.register(require('@fastify/websocket'), {
    options: { maxPayload: 1048576 }
})
fastify.get(
    "/", (req, reply) => {

        return reply.sendFile('./index.html')
    }
)
fastify.decorate('websocketManager', websocketManager)
const start = async () => {
    try {
        fastify.listen({port: port, host: '0.0.0.0'})
        console.log("application started on port: " + port)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
routes = fs.readdirSync(`./routes`).filter(file => file.endsWith(".js"))
routes.forEach(route => {
    let routeHandle = require(`./../routes/${route}`)
    if (Array.isArray(routeHandle)) {
        routeHandle.forEach(e => fastify.route(e))
    } else {
        fastify.route(routeHandle)
    }
})
start()

