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
        conn.setEncoding('utf8')
        req.log.info('socket connected')
        conn.socket.send(JSON.stringify({
            "calling": "onOpen",
            "event": "identify"
        }))
        req.log.info("Sent identify event to client")
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