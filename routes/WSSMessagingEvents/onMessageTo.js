module.exports = (conn, req) => {
    conn.socket.on('message', (message) => {
        message = JSON.parse(message)
        if (message.event == "sendTo") {
            if(global.wssConnectedPeers.admin && message.from != "admin"){
                global.wssConnectedPeers.admin.socket.send(JSON.stringify({
                    "calling" : "onMessageTo",
                    "event" : "message",
                    "message" : message.message,
                    "from" : message.from,
                    "identifier" : message.identifier
                }))
            }
            let findPeer = global.wssConnectedPeers[message.identifier]
            if (findPeer) {
                findPeer.socket.send(JSON.stringify({
                    "calling" : "onMessageTo",
                    "event" : "message",
                    "message" : message.message,
                    "from" : message.from
                }))
            }else
            {
                conn.socket.send(JSON.stringify({
                    "calling" : "onMessageTo",
                    "event" : "peerNotFound",
                    "identifier" : message.identifier
                }))
            }
        }
    })
}