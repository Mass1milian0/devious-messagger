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
const EventEmitter = require('events');
class DiscordMessager extends EventEmitter {
    constructor(client, channelsData) {
        super();
        this.client = client;
        this.specialChannels = {}; // Object to hold special channels
        this.normalChannels = new Map(); // Map to hold normal channels

        this.loadChannels(channelsData);
        this.setupListeners();
    }

    async loadChannels(channelsData) {
        channelsData = await channelsData
        channelsData = channelsData.map(channel => channel.dataValues)
        channelsData.forEach((channelData) => {
            const { channel_id, name, server_id } = channelData;
            const channelInfo = { channelId: channel_id, name, serverId: server_id };

            // Distinguish between special and normal channels
            if (server_id === null) {
                // Handle special channels
                switch (name) {
                    case 'global':
                    case 'global-staff':
                    case 'announcements':
                    case 'ticket-category':
                        this.specialChannels[name] = channelInfo;
                        break;
                    // ... other special channels
                }
            } else {
                // Handle normal channels
                this.normalChannels.set(name, channelInfo);
            }
        });
    }

    async setupWebhooks() {
        /**
         * special channels:
         * - global we both listen and send
         * - global-staff we only listen
         * - announcements we only listen
         * - ticket-category we only listen for new channels in this category
         */
        const specialChannels = Object.values(this.specialChannels);
        const normalChannels = Array.from(this.normalChannels.values());
        const channels = specialChannels.concat(normalChannels);
        let promises = [];
        for (const channel of channels) {
            const webhook = await this.client.channels.cache.get(channel.channelId).fetchWebhooks();
            if (webhook.size === 0) {
                // Create webhook if it doesn't exist
                promises.push(this.client.channels.cache.get(channel.channelId).createWebhook('Devious Messager'));
            }
        }
        await Promise.all(promises);
    }

    setupListeners() {
        this.client.on('message', (message) => {
            if (message.author.bot) return;
            // Check if message is in a special channel
            const channel = this.specialChannels[message.channel.name];
            if (channel) {
                switch (channel.name) {
                    case 'global':
                        this.emit('globalMessage', message);
                        break;
                    case 'global-staff':
                        this.emit('globalStaffMessage', message);
                        //relay to global and all servers
                        this.sendToGlobal(message.content, message.author.username, message.author.avatarURL())
                        for (let normalChannel of this.normalChannels.values()) {
                            this.sendToServer(normalChannel.name, message.content, message.author.username, message.author.avatarURL())
                        }
                        break;
                    case 'announcements':
                        this.emit('announcementMessage', message);
                        break;
                    case 'ticket-category':
                        this.emit('ticketCreated', message.channel);
                        break;
                    // ... other special channels
                }
            } else {
                // Check if message is in a normal channel
                const normalChannel = this.normalChannels.get(message.channel.name);
                if (normalChannel) {
                    this.emit('serverMessage', message, normalChannel.name);
                    //we also repeat the message to global
                    this.sendToGlobal(`[${normalChannel.name}] ${message.content}`, message.author.username, message.author.avatarURL());
                }
            }
        });
    }

    async sendWebhookMessage(channelName, message, username = "Devious Messager", avatar = process.env.BOT_AVATAR_URL) {
        try {
            let channel = this.chatMap.get(channelName);
            let webhooks = await this.client.channels.cache.get(channel.channelId).fetchWebhooks();
            let webhook = webhooks.find(wh => wh.name == "Devious Messager");
            await webhook.send({ content: message, username, avatarURL: avatar });
        } catch (error) {
            console.error(`Error sending webhook message: ${error}`);
        }
    }

    async sendToGlobal(message, username, avatar) {
        await this.sendWebhookMessage("global", message, username, avatar);
    }

    async sentToAllServers(message, username, avatar) {
        for (let normalChannel of this.normalChannels.values()) {
            await this.sendToServer(normalChannel.name, message, username, avatar);
        }
    }
    
    async sendToServer(server, message, username, avatar) {
        await this.sendWebhookMessage(server, message, username, avatar);
    }

    async getAnnouncements(amount) {
        let announcementsChannel = this.announcementsChannel
        let channel = await this.client.channels.cache.get(announcementsChannel.channelId)
        let messages = await channel.messages.fetch({ limit: amount })
        let parsedMessages = []
        messages.forEach(message => {
            parsedMessages.push({
                content: message.content,
                timestamp: message.createdTimestamp,
                author: {
                    username: message.author.username,
                    avatar: message.author.avatarURL()
                }
            })
        })
        return parsedMessages
    }

    async setBotStatus(status) {
        await this.client.user.setActivity(status)
    }

}

module.exports = DiscordMessager