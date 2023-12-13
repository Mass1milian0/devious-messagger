let route = {
    method: "GET",
    url: "/v1/ServerInfo",
    handler: (req, reply) => {
        let response = []
        for(let server of Object.keys(global.serverInfo)){
            if(global.serverMap[server]){
                global.serverInfo[server].ip = global.serverMap[server].ip
                global.serverInfo[server].serverName = global.serverMap[server].serverName
            }
            response.push(global.serverInfo[server])
        }
        reply.send(JSON.stringify(response));
    }
}
module.exports = route