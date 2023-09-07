module.exports = (conn, req) => {
    conn.socket.on('message', (message) => {
        message = JSON.parse(message)
        if (message.event == "globalMessage") {
            req.log.info("Sending global message")
            Object.entries(global.wssConnectedPeers).forEach(([key,value]) => {
                value.socket.send(JSON.stringify({
                    "calling" : "onAdminGlobalMessage",
                    "event" : "message",
                    "message" : message.message,
                    "from" : message.from
                }))
            });
        }
    })
}