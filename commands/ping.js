const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Did you mess up your Minecraft name? You can fix your whitelist here'),
    async execute(interaction) {
        // Sends Menu to Users Direct Messages
        interaction.reply({ ephemeral: true, content: "Pong" });
    }
}