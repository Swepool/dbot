"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wokcommands_1 = require("wokcommands");
const discord_js_1 = require("discord.js");
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const utils_1 = require("../utils");
exports.default = {
    description: "Check status",
    // Create a legacy and slash command
    type: wokcommands_1.CommandType.SLASH,
    // Invoked when a user runs the ping command
    callback: async ({ interaction }) => {
        const paprikaReq = await (0, cross_fetch_1.default)('https://api.coinpaprika.com/v1/tickers/xkr-kryptokrona');
        const paprikaRes = await paprikaReq.json();
        const reqSupply = await (0, cross_fetch_1.default)('https://blocksum.org/api/v1/supply');
        const resSupply = await reqSupply.json();
        const nodeReq = await (0, cross_fetch_1.default)('https://blocksum.org/api/getinfo');
        const nodeRes = await nodeReq.json();
        const { height, hashrate, difficulty } = nodeRes;
        const supply = parseInt(resSupply.supply.current);
        const price = paprikaRes.quotes.USD.price;
        const volume = paprikaRes.quotes.USD.volume_24h;
        const mcap = supply * price;
        console.log(mcap);
        const embed = new discord_js_1.EmbedBuilder()
            .setColor('#35ea6f')
            .setTitle('NETWORK STATUS <:godspeed:781930967077093377> ')
            .setDescription('Here some stats for ya')
            .setThumbnail('https://raw.githubusercontent.com/JustFragger/crypto-icons/main/kryptokrona.png')
            .addFields([
            { name: '\u200B', value: '\u200B' },
            { name: 'Supply 💰', value: `${(0, utils_1.numberWithCommas)(supply)} XKR` },
            { name: '\u200B', value: '\u200B' },
            {
                name: 'Hashrate <:Minershat:711146179572006913>',
                value: `${(0, utils_1.numberWithCommas)(hashrate / 1000000)} MH/S`,
                inline: true
            },
            { name: ' Height 📦', value: ` ${(0, utils_1.numberWithCommas)(height)}`, inline: true },
            { name: ' Difficulty  🗻', value: ` ${(0, utils_1.numberWithCommas)(difficulty / 1000000)} M`, inline: true },
            { name: '\u200B', value: '\u200B' },
            { name: 'Price 🏷', value: `$${price.toFixed(7)}`, inline: true },
            { name: ' Volume 🔊', value: ` $${(0, utils_1.numberWithCommas)(volume)}`, inline: true },
            { name: ' MCAP 🤑', value: ` $${(0, utils_1.numberWithCommas)(mcap)}`, inline: true },
            { name: '\u200B', value: '\u200B' },
        ])
            .setFooter({ text: 'Market data provided by CoinPaprika' })
            .setTimestamp();
        return interaction.reply({
            embeds: [embed]
        });
    },
};
//# sourceMappingURL=status.js.map