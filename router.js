const fs = require('fs')
const port = process.env.PORT || 8080
const envToLogger = {
    development: {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    },
    production: true,
    test: false,
  }
const fastify = require('fastify')({
    logger: envToLogger["development"]
})
fastify.register(require('@fastify/static'), {
    root: `${__dirname}//public`,
    prefix: '/', // optional: default '/'

})
fastify.register(require('@fastify/websocket'), {
    options: { maxPayload: 1048576 }
})
fastify.register(async function (fastify, opts) {
    fastify.get('/WSMessaging', { websocket: true }, (connection, req) => {
        connection.socket.on('message', message => {
            console.log(message)
        })
    })
})
fastify.get(
    "/", (req, reply) => {

        return reply.sendFile('./index.html')
    }
)
const start = async () => {
    try {
        await fastify.listen({port: port, host: '127.0.0.1'})
        console.log("application started on port: " + port)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
routes = fs.readdirSync(`./routes`).filter(file => file.endsWith(".js"))
routes.forEach(route => {
    let routeHandle = require(`./routes/${route}`)
    if (Array.isArray(routeHandle)) {
        routeHandle.forEach(e => fastify.route(e))
    } else {
        fastify.route(routeHandle)
    }
})
start()

