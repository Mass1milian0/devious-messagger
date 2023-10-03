module.exports = (conn, req) => {
    conn.socket.on('message', (message) => {
        message = JSON.parse(message)
        if (message.event == "serverState") {
            let server = message.server
            let state = message.state
            let msg = state == "started" ? "has started" : "is stopping"
            global.discordMessager.sendToGlobal(`${server} ${msg}.`)
            global.discordMessager.sendToServer(server, `${server} ${msg}.`)
        }
    })
}