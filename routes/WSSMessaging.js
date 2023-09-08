const fs = require('fs')
const crypto = require('crypto')
global.wssConnectedPeers = {}
const route = {
    method: 'GET',
    url: '/WSSMessaging',
    handler: (req, reply) => {
        let key = req.headers["sec-websocket-key"];
        // If key is missing, return error
        if (!key) return reply.code(400).send("Missing key");
        // If key is not of the right length, return error
        if (key.length != 24) return reply.code(400).send("Invalid key");
        // If key is already in use, return error
        if (global.wssConnectedPeers[key]) return reply.code(400).send("Key already in use");

        // Generate the hash value for the accept header according to the websocket protocol
        let hash = crypto.createHash('sha1');
        hash.update(key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11");
        hash = hash.digest('base64');

        reply.code(101);
        reply.headers({
            "Upgrade": "websocket",
            "Connection": "Upgrade",
            "Sec-WebSocket-Accept": hash,
            //"Sec-WebSocket-Protocol": "devious"
        }).send();
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