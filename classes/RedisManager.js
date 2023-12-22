const Redis = require('ioredis');
const verboseLog = require("./../services/logger.js")
const redis = new Redis(process.env.REDIS_URL);

class RedisManager extends Redis {
    constructor() {
        super();
        this.on("connect", () => {
            verboseLog("Connected to Redis")
        })
        this.on("error", (err) => {
            verboseLog("Redis Error: " + err)
        })
    }
    
    async get(key) {
        let result = await super.get(key);
        return JSON.parse(result);
    }

    async set(key, value) {
        return await super.set(key, JSON.stringify(value));
    }
}

module.exports = RedisManager;