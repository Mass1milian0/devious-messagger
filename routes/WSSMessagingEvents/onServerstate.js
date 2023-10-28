module.exports = (conn, req) => {
    conn.socket.on('message', (message) => {
        message = JSON.parse(message)
        if (message.event == "serverState") {
            global.verboseLog("serverState event recieved with server: " + message.server + " with state: " + message.state)
            let server = message.server
            if(!global.wssConnectedPeers[server]){
                global.verboseLog("server not found in wssConnectedPeers, adding it to the list")
                global.wssConnectedPeers[server] = conn
            }
            let state = message.state
            let msg = state == "started" ? "has started" : "is stopping"
            global.discordMessager.sendToGlobal(`${server} ${msg}.`)
            global.discordMessager.sendToServer(server, `${server} ${msg}.`)
        }
    })
}