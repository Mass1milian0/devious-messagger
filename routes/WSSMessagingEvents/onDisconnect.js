module.exports = (conn, req) => {
    conn.socket.on('close', () => {
        let backup = global.wssConnectedPeers
        global.wssConnectedPeers = {}
        Object.values(backup).forEach(conSock => {
            conSock.socket.send(JSON.stringify({
                event: "identify"
            }))
        })
    })
}