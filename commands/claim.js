const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');

// Oyuncu verilerini JSON dosyasından oku
const players = JSON.parse(fs.readFileSync(path.join(__dirname, '../players.json'), 'utf8'));

// Kullanıcı ID'lerine göre cooldownları tutan obje
const cooldowns = {};
const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 1 gün

const dataPath = path.join(__dirname, '../data.json');
function loadData() {
    if (!fs.existsSync(dataPath)) {
        return { users: {} };
    }
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}
function saveData(data) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

module.exports = {
    name: 'claim',
    description: 'Rastgele futbolcu kartı kazanırsın (1 gün cooldown)',
    execute(message, args) {
        const userId = message.author.id;
        const now = Date.now();
        if (cooldowns[userId] && now - cooldowns[userId] < COOLDOWN_MS) {
            const kalan = Math.ceil((COOLDOWN_MS - (now - cooldowns[userId])) / 1000 / 60 / 60);
            return message.reply(`Bu komutu tekrar kullanmak için ${kalan} saat beklemelisin!`);
        }
        cooldowns[userId] = now;
        const randomPlayer = players[Math.floor(Math.random() * players.length)];
        // Kullanıcı verisini güncelle
        const data = loadData();
        if (!data.users[userId]) {
            data.users[userId] = { bakiye: 0, kartlar: [] };
        }
        // Kartı ekle (aynı kart birden fazla olabilir)
        data.users[userId].kartlar.push(randomPlayer.id);
        saveData(data);
        // Embed mesajı
        const embed = new EmbedBuilder()
            .setTitle(`🎉 Tebrikler! Kartın: ${randomPlayer.name}`)
            .setDescription(`ID: ${randomPlayer.id}\nDeğer: ${randomPlayer.value}`)
            .setImage(randomPlayer.image)
            .setColor(0x1abc9c);
        message.channel.send({ embeds: [embed] });
    },
}; 