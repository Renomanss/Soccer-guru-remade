const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'market',
    description: 'Market: Kartları listele veya satın al',
    async execute(message, args) {
        const userId = message.author.id;
        const dataPath = path.join(__dirname, '../data.json');
        const playersPath = path.join(__dirname, '../players.json');
        if (!fs.existsSync(playersPath)) {
            return message.reply('Oyuncu verisi bulunamadı!');
        }
        const players = JSON.parse(fs.readFileSync(playersPath, 'utf8'));
        // Eğer hiç argüman yoksa marketi listele
        if (!args[0]) {
            let desc = '';
            players.forEach(card => {
                desc += `\n• **${card.name}** (ID: ${card.id}) - Fiyat: ${card.value}`;
            });
            const embed = new EmbedBuilder()
                .setTitle('🛒 Kart Marketi')
                .setDescription(desc)
                .setColor(0x2980b9);
            return message.channel.send({ embeds: [embed] });
        }
        // Satın alma işlemi
        if (!fs.existsSync(dataPath)) {
            return message.reply('Veri bulunamadı!');
        }
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        const user = data.users[userId];
        if (!user) {
            return message.reply('Önce bir kart kazanmalısın!');
        }
        const cardId = args[0];
        const card = players.find(p => p.id == cardId);
        if (!card) {
            return message.reply('Böyle bir kart bulunamadı!');
        }
        if (user.bakiye < card.value) {
            return message.reply('Yeterli bakiyen yok!');
        }
        user.bakiye -= card.value;
        user.kartlar.push(card.id);
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        const embed = new EmbedBuilder()
            .setTitle('✅ Kart Satın Alındı!')
            .setDescription(`Kart: **${card.name}**\nFiyat: **${card.value}**\nKalan Bakiye: **${user.bakiye}**`)
            .setImage(card.image)
            .setColor(0x27ae60);
        message.channel.send({ embeds: [embed] });
    },
}; 