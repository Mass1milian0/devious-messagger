let route = {
    method:"GET",
    url:"/v1/DiscordAnnouncements",
    handler: async (req,reply)=>{
        let response = await global.discordMessager.getAnnouncements(10);
        reply.send(JSON.stringify(response));
    }
    
}
module.exports = route