const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'sat',
    description: 'Bir kartı %50 değerine satar',
    execute(message, args) {
        const userId = message.author.id;
        const dataPath = path.join(__dirname, '../data.json');
        const playersPath = path.join(__dirname, '../players.json');
        if (!fs.existsSync(dataPath)) {
            return message.reply('Veri bulunamadı!');
        }
        if (!fs.existsSync(playersPath)) {
            return message.reply('Oyuncu verisi bulunamadı!');
        }
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        const players = JSON.parse(fs.readFileSync(playersPath, 'utf8'));
        const user = data.users[userId];
        if (!user || !user.kartlar || user.kartlar.length === 0) {
            return message.reply('Satacak kartın yok!');
        }
        const cardId = args[0];
        if (!cardId) {
            return message.reply('Satmak istediğin kartın ID numarasını gir!');
        }
        // Kullanıcının elinde bu kart var mı?
        const cardIndex = user.kartlar.indexOf(Number(cardId));
        if (cardIndex === -1) {
            return message.reply('Bu ID ile bir kartın yok!');
        }
        const card = players.find(p => p.id == cardId);
        if (!card) {
            return message.reply('Böyle bir kart bulunamadı!');
        }
        const sellValue = Math.floor(card.value * 0.5);
        // Kartı sil ve parayı ekle
        user.kartlar.splice(cardIndex, 1);
        user.bakiye += sellValue;
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        const embed = new EmbedBuilder()
            .setTitle('🪙 Kart Satıldı!')
            .setDescription(`Kart: **${card.name}**\nSatış Fiyatı: **${sellValue}**\nYeni Bakiye: **${user.bakiye}**`)
            .setColor(0xe67e22);
        message.channel.send({ embeds: [embed] });
    },
}; 