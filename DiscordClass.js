require('dotenv').config();
const fs = require('fs');
const EventEmitter = require('events');

class DiscordMessager extends EventEmitter {
    constructor(client){
        super()
        this.client = client
        //let's map stuff now
        let chatMap = fs.readFileSync('./chatMap.json')
        this.chatMap = JSON.parse(chatMap)
        this.globalChannel = this.chatMap.find(channel => channel.name == "global")

        //initialize message listener and event emitter
        this.client.on('messageCreate', (message) => {
            console.log("message received")
            if (message.channelId == this.globalChannel.channelId) {
                //ignore bot messages
                if (message.author.bot) return
                console.log("global message received, event emitted")
                this.emit('globalMessage', message)
            } else {
                this.chatMap.forEach(channel => {
                    if (message.channelId == channel.id) {
                        this.emit('serverMessage', message, channel.name)
                    }
                })
            }
        })
    }
    async sendToGlobal(message){
        this.client.channels.cache.get(this.globalChannel.channelId).send(message)
    }
    async sendToServer(server, message){
        let serverChannel = this.chatMap.find(channel => channel.name == server)
        this.client.channels.cache.get(serverChannel.channelId).send(message)
    }
}

module.exports = DiscordMessager