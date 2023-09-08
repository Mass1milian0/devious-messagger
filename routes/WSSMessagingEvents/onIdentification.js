module.exports = (conn, req) => {
    conn.socket.on('message', (message) => {
        message = JSON.parse(message)
        console.log(message)
        if (message.event == "identify") {
            global.wssConnectedPeers[message.identifier] = conn
            //i send the new connection the peerConnected
            Object.entries(global.wssConnectedPeers).forEach(([key,value]) => {
                if(key != "admin"){
                    conn.socket.send(JSON.stringify({
                        "calling" : "onIdentification",
                        "event" : "peerConnected",
                        "peer" : key
                    }))
                }
                if(key != message.identifier){
                        if (message.identifier != "admin"){
                        value.socket.send(JSON.stringify({
                            "calling" : "onIdentification",
                            "event" : "peerConnected",
                            "peer" : message.identifier
                        }))
                    }
                }
            });
        }
    })
}