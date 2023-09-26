module.exports = (conn, req) => {
    conn.socket.on('message', (message) => {
        message = JSON.parse(message)
        if (message.event == "playerCount") {
            let count = message.count
            if(!global.playerCount){
                global.playerCount = count
            }else {
                if(count > global.playerCount){
                    //if the count is higher than the current count, we add the difference
                    global.playerCount += count
                }else{
                    //if the count is lower than the current count, we subtract the difference
                    global.playerCount -= count
                }
            }
            if(global.playerCount < 0) global.playerCount = 0 //just in case
            global.discordMessager.setBotStatus(`${global.playerCount} players online`)
        }
    })
}