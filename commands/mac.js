const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'match',
    description: 'Simulates a match and shows your cash and total cards',
    execute(message, args) {
        const userId = message.author.id;
        const dataPath = path.join(__dirname, '../data.json');
        if (!fs.existsSync(dataPath)) {
            return message.reply('No data found!');
        }
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        const user = data.users[userId];
        if (!user) {
            return message.reply('No data found!');
        }
        const score1 = Math.floor(Math.random() * 5);
        const score2 = Math.floor(Math.random() * 5);
        const totalCards = user.kartlar ? user.kartlar.length : 0;
        const embed = new EmbedBuilder()
            .setTitle(`⚽ FC Discord ${score1} - ${score2} Opponent`)
            .setDescription(`💸 **Cash:** ${user.bakiye ?? 0}\n🎴 **Total Cards:** ${totalCards}`)
            .setColor(0x3498db);
        message.channel.send({ embeds: [embed] });
    },
}; 