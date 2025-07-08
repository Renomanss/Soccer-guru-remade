const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'team',
    description: 'Shows your team info, cash, and total cards',
    execute(message, args) {
        const userId = message.author.id;
        const dataPath = path.join(__dirname, '../data.json');
        if (!fs.existsSync(dataPath)) {
            return message.reply('You have no team data!');
        }
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        const user = data.users[userId];
        if (!user) {
            return message.reply('You have no team data!');
        }
        const totalCards = user.kartlar ? user.kartlar.length : 0;
        const embed = new EmbedBuilder()
            .setTitle('⚽ Team Info')
            .setDescription(`⚽ **Team:** ${message.author.username}'nın Takımı\n👤 **Manager:** ${message.author.username}\n💸 **Cash:** ${user.bakiye ?? 0}\n🎴 **Total Cards:** ${totalCards}`)
            .setColor(0x8e44ad);
        message.channel.send({ embeds: [embed] });
    },
}; 