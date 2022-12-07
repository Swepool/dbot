import { CommandObject, CommandType } from 'wokcommands'
import { EmbedBuilder}  from "discord.js";
import fetch from "cross-fetch";
import {numberWithCommas} from "../utils";

export default {
    description: "Check status",

    // Create a legacy and slash command
    type: CommandType.SLASH,
    // Invoked when a user runs the ping command
    callback: async ({interaction}) => {
        const paprikaReq = await fetch('https://api.coinpaprika.com/v1/tickers/xkr-kryptokrona')
        const paprikaRes = await paprikaReq.json()
        const reqSupply = await fetch('https://blocksum.org/api/v1/supply')
        const resSupply = await reqSupply.json()
        const nodeReq = await fetch('https://blocksum.org/api/getinfo')
        const nodeRes = await nodeReq.json()

        const {height, hashrate, difficulty} = nodeRes

        const supply = parseInt(resSupply.supply.current)
        const price = paprikaRes.quotes.USD.price
        const volume = paprikaRes.quotes.USD.volume_24h
        const mcap = supply * price
        console.log(mcap)

        const embed = new EmbedBuilder()
            .setColor('#35ea6f')
            .setTitle('NETWORK STATUS <:godspeed:781930967077093377> ')
            .setDescription('Here some stats for ya')
            .setThumbnail('https://raw.githubusercontent.com/JustFragger/crypto-icons/main/kryptokrona.png')
            .addFields([
                    {name: '\u200B', value: '\u200B'},
                    {name: 'Supply 💰', value: `${numberWithCommas(supply)} XKR`},
                    {name: '\u200B', value: '\u200B'},
                    {
                        name: 'Hashrate <:Minershat:711146179572006913>',
                        value: `${numberWithCommas(hashrate / 1000000)} MH/S`,
                        inline: true
                    },
                    {name: ' Height 📦', value: ` ${numberWithCommas(height)}`, inline: true},
                    {name: ' Difficulty  🗻', value: ` ${numberWithCommas(difficulty / 1000000)} M`, inline: true},
                    {name: '\u200B', value: '\u200B'},
                    {name: 'Price 🏷', value: `$${price.toFixed(7)}`, inline: true},
                    {name: ' Volume 🔊', value: ` $${numberWithCommas(volume)}`, inline: true},
                    {name: ' MCAP 🤑', value: ` $${numberWithCommas(mcap)}`, inline: true},
                    {name: '\u200B', value: '\u200B'},
            ]
            )
            .setFooter({text: 'Market data provided by CoinPaprika'})
            .setTimestamp()

        return interaction.reply({
            embeds: [embed]
        })
    },
} as CommandObject