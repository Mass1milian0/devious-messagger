module.exports = (conn, req) => {
    conn.socket.on('message', (message) => {
        message = JSON.parse(message)
        if(message.event == "identify"){
            req.log.info("identified client: " + message.identifier)
            global.wssConnectedPeers[message.identifier] = conn
        }
    })
}