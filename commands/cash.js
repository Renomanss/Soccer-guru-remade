const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'cash',
    description: 'Shows your cash amount',
    execute(message, args) {
        const userId = message.author.id;
        const dataPath = path.join(__dirname, '../data.json');
        if (!fs.existsSync(dataPath)) {
            return message.reply('No data found!');
        }
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        const user = data.users[userId];
        if (!user) {
            return message.reply('No cash data found!');
        }
        const embed = new EmbedBuilder()
            .setTitle('💸 Cash Info')
            .setDescription(`👤 **User:** ${message.author.username}\n💸 **Cash:** ${user.bakiye}`)
            .setColor(0x27ae60);
        message.channel.send({ embeds: [embed] });
    },
}; 
