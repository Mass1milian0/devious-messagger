/*
    Receives:
        message: {
            event: "message",
            server: "serverName",
            player: "playerName",
            message: "messageContent"
        }
    Sends:
        message: {
            event: "message",
            username: "Username",
            channel: "global" / "server",
            message: "message"
        }
*/

module.exports = (conn, req) => {
    conn.socket.on('message', (message) => {
        message = JSON.parse(message)
        if (message.event == "message") {
            let server = message.server
            let player = message.player
            let content = message.message
            global.discordMessager.sendToGlobal(`[${server}] ${player}: ${content}`)
        }
    })
}