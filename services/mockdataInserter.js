const database = require('./database');

function insertMockdata() {
    let chatChannels = [
        {
            channel_id: '1155113500125966426',
            name: 'global',
            server_id: null
        },
        {
            channel_id: '1158834300167393421',
            name: 'global-staff',
            server_id: null
        },
        {
            channel_id: '1167817468660686939',
            name: 'ticket-category',
            server_id: null
        },
        {
            channel_id: '1184566881932300430',
            name: 'announcements',
            server_id: null
        },
        {
            channel_id: '1155113526772387941',
            name: 'ATM9-chat',
            server_id: 'ATM9'
        },
        {
            channel_id: '1155460245200584764',
            name: 'E9E-chat',
            server_id: 'E9E'
        }
    ]
    let ranks = [
        {
            rank_uuid: 1,
            rank_name: 'Owner',
            rank_description: 'The owner of the server'
        },
        {
            rank_uuid: 2,
            rank_name: 'Admin',
            rank_description: 'The admins of the server'
        },
        {
            rank_uuid: 3,
            rank_name: 'Mod',
            rank_description: 'The moderators of the server'
        },
        {
            rank_uuid: 4,
            rank_name: 'Helper',
            rank_description: 'The helpers of the server'
        },
        {
            rank_uuid: 5,
            rank_name: 'Staff',
            rank_description: 'The staff of the server'
        },
        {
            rank_uuid: 6,
            rank_name: 'Member',
            rank_description: 'The members of the server'
        }
    ]
    let servers = [
        {
            server_id: 'ATM9',
            server_name: 'ATM9',
            server_ip: 'atm9.devious.gg',
            server_amp_id: 'ATM901'
        },
        {
            server_id: 'E9E',
            server_name: 'E9E',
            server_ip: 'e9e.devious.gg',
            server_amp_id: 'E9E01'
        }
    ]

    let users = [
        {
            user_uuid: 'a954dc31-6031-44a3-a4fa-d7bd25b9314b',
            user_discord_id: '342800846595031050',
            user_coins: 0,
        },
        {
            user_uuid: 'fake-user-uuid',
            user_discord_id: 'fake-user-discord-id',
            user_coins: 0,
        },
        {
            user_uuid: 'fake-user-uuid2',
            user_discord_id: 'fake-user-discord-id2',
            user_coins: 0,
        },
        {
            user_uuid: 'fake-user-uuid3',
            user_discord_id: 'fake-user-discord-id3',
            user_coins: 0,
        },
        {
            user_uuid: 'fake-staff-uuid',
            user_discord_id: 'fake-staff-discord-id',
            user_coins: 0,
        }
    ]

    let whitlist = [
        {
            whitelist_user_uuid: 'a954dc31-6031-44a3-a4fa-d7bd25b9314b',
            whitelist_server_id: 'ATM9',
        },
        {
            whitelist_user_uuid: 'a954dc31-6031-44a3-a4fa-d7bd25b9314b',
            whitelist_server_id: 'E9E',
        }
    ]

    let userRanks = [
        {
            user_uuid: 'a954dc31-6031-44a3-a4fa-d7bd25b9314b',
            rank_uuid: 1,
        },
        {
            user_uuid: 'a954dc31-6031-44a3-a4fa-d7bd25b9314b',
            rank_uuid: 5,
        },
        {
            user_uuid: 'fake-user-uuid',
            rank_uuid: 6,
        },
        {
            user_uuid: 'fake-user-uuid2',
            rank_uuid: 6,
        },
        {
            user_uuid: 'fake-user-uuid3',
            rank_uuid: 6,
        },
        {
            user_uuid: 'fake-staff-uuid',
            rank_uuid: 4,
        },
        {
            user_uuid: 'fake-staff-uuid',
            rank_uuid: 5,
        }
    ]	
    //load the mockdata into the database
    database.servers.bulkCreate(servers)
    database.chatChannels.bulkCreate(chatChannels)
    database.ranks.bulkCreate(ranks)
    database.users.bulkCreate(users)
    database.usersRank.bulkCreate(userRanks)
    database.whitelist.bulkCreate(whitlist)
}

module.exports = insertMockdata