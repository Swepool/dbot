"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wokcommands_1 = require("wokcommands");
const discord_js_1 = require("discord.js");
const utils_1 = require("../utils");
const cross_fetch_1 = __importDefault(require("cross-fetch"));
exports.default = {
    description: "Calculate your mining rewards",
    // Create a legacy and slash command
    type: wokcommands_1.CommandType.SLASH,
    options: [
        {
            name: "hashrate",
            description: "Enter your hashrate",
            type: discord_js_1.ApplicationCommandOptionType.Number,
            required: true,
        },
    ],
    // Invoked when a user runs the ping command
    callback: async (options, interaction) => {
        const poolReq = await (0, cross_fetch_1.default)('https://swepool.org/api/stats');
        const poolRes = await poolReq.json();
        const nodeReq = await (0, cross_fetch_1.default)('https://blocksum.org/api/getinfo');
        const nodeRes = await nodeReq.json();
        let hashrate = options.args.reduce((acc, cur) => {
            return acc + Number(cur);
        }, 0);
        let networkHashrate = nodeRes.hashrate;
        let currentHashrate = nodeRes.hashrate / 1000;
        let dailyReward = (poolRes.lastblock.reward * 960) / 100000;
        const embed = new discord_js_1.EmbedBuilder()
            .setColor('#f69e25')
            .setTitle('Mining Stats <:Minershat:711146179572006913>')
            .setDescription('OBS. this is an estimate, will differ depending on network')
            .setAuthor({
            name: 'Kryptokrona',
            iconURL: 'https://raw.githubusercontent.com/JustFragger/crypto-icons/main/kryptokrona.png',
            url: 'https://kryptokrona.org'
        })
            .setThumbnail('https://raw.githubusercontent.com/JustFragger/crypto-icons/main/kryptokrona.png')
            .addFields([
            { name: '\u200B', value: '\u200B' },
            { name: 'Total hashrate', value: `${(0, utils_1.numberWithCommas)(networkHashrate / 1000000)} MH/S` },
            {
                name: 'Your share (%)',
                value: `Your ${hashrate} KH/s is ${((hashrate / currentHashrate) * 100).toFixed(4)}% of the total hashrate`
            },
            { name: '\u200B', value: '\u200B' },
            { name: 'Mining Calculation 🧮', value: "-" },
            {
                name: 'Daily',
                value: `${(0, utils_1.numberWithCommas)((hashrate / currentHashrate) * dailyReward)} XKR`,
                inline: true
            },
            {
                name: 'Weekly',
                value: `${(0, utils_1.numberWithCommas)(((hashrate / currentHashrate) * dailyReward) * 7)} XKR`,
                inline: true
            },
            {
                name: 'Monthly',
                value: `${(0, utils_1.numberWithCommas)((((hashrate / currentHashrate) * dailyReward) * 7) * 4)} XKR`,
                inline: true
            },
        ])
            .setFooter({ text: 'Mining data provided by Swepool & Blocksum' })
            .setTimestamp();
        await options.interaction.reply({
            embeds: [embed]
        });
    },
};
//# sourceMappingURL=earn.js.map