const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'cards',
    description: 'Shows your football card collection and cash',
    execute(message, args) {
        const userId = message.author.id;
        const dataPath = path.join(__dirname, '../data.json');
        const playersPath = path.join(__dirname, '../players.json');
        if (!fs.existsSync(dataPath)) {
            return message.reply('You have no cards!');
        }
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        const players = JSON.parse(fs.readFileSync(playersPath, 'utf8'));
        const user = data.users[userId];
        if (!user || !user.kartlar || user.kartlar.length === 0) {
            return message.reply('You have no cards!');
        }
        // Group cards (how many of each)
        const cardCounts = {};
        user.kartlar.forEach(id => {
            cardCounts[id] = (cardCounts[id] || 0) + 1;
        });
        let desc = `💸 Cash: ${user.bakiye ?? 0}\n`;
        Object.entries(cardCounts).forEach(([id, count]) => {
            const card = players.find(p => p.id == id);
            if (card) {
                desc += `\n• ${card.name} (ID: ${card.id}, Value: ${card.value}) x${count}`;
            }
        });
        const embed = new EmbedBuilder()
            .setTitle(`**${message.author.username}** - Card Collection`)
            .setDescription(desc)
            .setColor(0xf1c40f);
        message.channel.send({ embeds: [embed] });
    },
}; 