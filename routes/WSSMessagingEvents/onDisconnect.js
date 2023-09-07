module.exports = (conn, req) => {
    conn.socket.on('close', (message) => {
        //since there is no way to identify who disconnected
        //we will resend the identify event to all clients and after that rebuild the global.wssConnectedPeers object
        let temp = global.wssConnectedPeers
        global.wssConnectedPeers = {}
        Object.entries(temp).forEach(([key,value]) => {
            req.log.info("Sending identify event to " + key)
            value.socket.send(JSON.stringify({
                "calling" : "onClose",
                "event" : "peerReset"
            }))
            value.socket.send(JSON.stringify({
                "calling" : "onClose",
                "event" : "identify"
            }))
        });
    })
}