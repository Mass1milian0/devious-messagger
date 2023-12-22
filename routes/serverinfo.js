const redisInstance = require("./../services/redisInstance.js")
let route = {
    method: "GET",
    url: "/v1/ServerInfo",
    handler: async (req, reply) => {
        let response = await redisInstance.get("servers")
        reply.send(JSON.stringify(response))
    }
}
module.exports = route