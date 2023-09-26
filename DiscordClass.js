/*
This file is part of Devious Messager.
 Copyright (C) 2023 M1S0

Devious Messager is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
  
*/
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
            if (message.channelId == this.globalChannel.channelId) {
                //ignore bot messages
                if (message.author.bot) return
                this.emit('globalMessage', message)
            } else {
                this.chatMap.forEach(channel => {
                    if (message.channelId == channel.channelId) {
                        if (message.author.bot) return
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
    async setBotProfilePicture(url){
        await this.client.user.setAvatar(url)
    }
    async setBotStatus(status){
        await this.client.user.setActivity(status)
    }
    async setBotUsername(username){
        await this.client.user.setUsername(username)
    }
    async resetBotProfilePicture(){
        await this.client.user.setAvatar(process.env.BOT_AVATAR_URL)
    }
    async resetBotStatus(){
        await this.client.user.setActivity("nothing")
    }
    async resetBotUsername(){
        await this.client.user.setUsername("Devious Messager")
    }
}

module.exports = DiscordMessager