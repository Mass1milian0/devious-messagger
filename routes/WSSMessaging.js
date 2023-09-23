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
        req.log.info("asking for identification")
        conn.socket.send(JSON.stringify({
            event: "identify"
        }))
        fs.readdirSync(`./routes/WSSMessagingEvents`).forEach(event => {
            let eventHandle = require(`./WSSMessagingEvents/${event}`)
            if (Array.isArray(eventHandle)) {
                eventHandle.forEach(e => e(conn, req))
            } else {
                eventHandle(conn, req)
            }
        })
        global.discordMessager.on("globalMessage", (message) => {
            console.log("global message received, event received")
            Object.values(global.wssConnectedPeers).forEach(peer => {
                console.log("sending message to peer")
                console.log(peer)
                peer.socket.send(JSON.stringify({
                    event: "message",
                    username: message.author.username,
                    channel: "global",
                    message: message.content
                }))
            })
        })
    }
}
module.exports = route