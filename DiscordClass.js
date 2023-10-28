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

class DiscordMessager extends EventEmitter{
    constructor(client){
        super()
        this.client = client
        //let's map stuff now
        let chatMap = fs.readFileSync('./chatMap.json')
        this.chatMap = JSON.parse(chatMap)
        this.globalChannel = this.chatMap.find(channel => channel.name == "global")
        this.globalStaffChannel = this.chatMap.find(channel => channel.name == "global-staff")
        //if global channel or global staff channel doesn't exist, assign '0' to the channelId
        if(!this.globalChannel) this.globalChannel = {channelId: '0'}
        if(!this.globalStaffChannel) this.globalStaffChannel = {channelId: '0'}

        //setup a webhook to send to the mapped channels if it's not already set up
        for(let channel of this.chatMap){
            if(channel.name == "ticket-category") {
                this.ticketCategory = channel.channelId
                continue;
            }
            this.client.channels.cache.get(channel.channelId).fetchWebhooks().then(webhooks => {
                //if it has a webhook, check if it's the correct name, it should have the name "Devious Messager"
                let webhook = webhooks.find(webhook => webhook.name == "Devious Messager")
                //if it doesn't have a webhook, create one
                if(!webhook){
                    this.client.channels.cache.get(channel.channelId).createWebhook("Devious Messager", {
                        avatar: process.env.BOT_AVATAR_URL,
                        name: "Devious Messager"
                    }).then(webhook => {
                        //now we have a webhook, let's save it to the chatMap
                        channel.webhookId = webhook.id
                        channel.webhookToken = webhook.token
                        this.chatMap[this.chatMap.indexOf(channel)] = channel
                    })
                }
            })
        }

        //initialize message listener and event emitter
        this.client.on('messageCreate', (message) => {
            if(message.channelId == this.globalStaffChannel.channelId){
                //ignore bot messages
                if(message.author.bot) return
                return this.emit('globalStaffMessage', message)
            }
            if (message.channelId == this.globalChannel.channelId) {
                //ignore bot messages
                if (message.author.bot) return
                return this.emit('globalMessage', message)
            } else {
                this.chatMap.forEach(channel => {
                    if (message.channelId == channel.channelId) {
                        if (message.author.bot) return
                        return this.emit('serverMessage', message, channel.name)
                    }
                })
            }
        })
        this.client.on('channelCreate', (channel) => {
            if(channel.parentId == this.ticketCategory){
                this.emit('ticketCreated', channel)
            }
        })
    }
    async sendToGlobal(message, username, avatar){
        if(!username) username = "Devious Messager"
        if(!avatar) avatar = process.env.BOT_AVATAR_URL
        let globalChannel = this.chatMap.find(channel => channel.name == "global")
        let webhook = await this.client.channels.cache.get(globalChannel.channelId).fetchWebhooks()
        webhook = webhook.find(webhook => webhook.name == "Devious Messager")
        webhook.send({
            content: message,
            username: username,
            avatarURL: avatar
        })
    }
    async sendToServer(server, message, username, avatar){
        if(!username) username = "Devious Messager"
        if(!avatar) avatar = process.env.BOT_AVATAR_URL
        let channel = this.chatMap.find(channel => channel.name == server)
        let webhook = await this.client.channels.cache.get(channel.channelId).fetchWebhooks()
        webhook = webhook.find(webhook => webhook.name == "Devious Messager")
        webhook.send({
            content: message,
            username: username,
            avatarURL: avatar
        })
    }
    async setBotStatus(status){
        await this.client.user.setActivity(status)
    }
}

module.exports = DiscordMessager