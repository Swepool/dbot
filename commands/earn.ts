import {CommandObject, CommandType, CommandUsage} from 'wokcommands'
import {EmbedBuilder, ApplicationCommandOptionType} from "discord.js";
import {numberWithCommas} from "../utils";
import fetch from 'cross-fetch'

export default {
    description: "Calculate your mining rewards",

    // Create a legacy and slash command
    type: CommandType.SLASH,

    options: [
        {
            name: "hashrate",
            description: "Enter your hashrate",
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
    ],

    // Invoked when a user runs the ping command
    callback: async (options: CommandUsage, interaction) => {

        const poolReq = await fetch('https://swepool.org/api/stats')
        const poolRes = await poolReq.json()
        const nodeReq = await fetch('https://blocksum.org/api/getinfo')
        const nodeRes = await nodeReq.json()

        let hashrate = options.args.reduce((acc, cur) => {
            return acc + Number(cur);
        }, 0)

        let networkHashrate = nodeRes.hashrate
        let currentHashrate = nodeRes.hashrate / 1000
        let dailyReward = (poolRes.lastblock.reward * 960) / 100000
        

        const embed = new EmbedBuilder()
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
                    {name: '\u200B', value: '\u200B'},
                    {name: 'Total hashrate', value: `${numberWithCommas(networkHashrate / 1000000)} MH/S`},
                    {
                        name: 'Your share (%)',
                        value: `Your ${hashrate} KH/s is ${((hashrate / currentHashrate) * 100).toFixed(4)}% of the total hashrate`
                    },
                    {name: '\u200B', value: '\u200B'},
                    {name: 'Mining Calculation 🧮', value: "-"},
                    {
                        name: 'Daily',
                        value: `${numberWithCommas((hashrate / currentHashrate) * dailyReward)} XKR`,
                        inline: true
                    },
                    {
                        name: 'Weekly',
                        value: `${numberWithCommas(((hashrate / currentHashrate) * dailyReward) * 7)} XKR`,
                        inline: true
                    },
                    {
                        name: 'Monthly',
                        value: `${numberWithCommas((((hashrate / currentHashrate) * dailyReward) * 7) * 4)} XKR`,
                        inline: true
                    },
                ]
            )
            .setFooter({text: 'Mining data provided by Swepool & Blocksum'})
            .setTimestamp()

        await options.interaction.reply({
            embeds: [embed]
        })
    },
} as CommandObject