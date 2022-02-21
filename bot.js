import DiscordJS, {Intents, MessageEmbed} from 'discord.js'
import fetch from "node-fetch";
import dotenv from 'dotenv'

dotenv.config()

// Declare your intents (What you want access to)
const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
})

client.on('ready', () => {

    const guildId = '788875613753835530'
    const guild = client.guilds.cache.get(guildId)
    let commands

    if (guild) {
        commands = guild.commands
    } else {
        commands = client.application?.commands
    }

    commands?.create({
        name: 'ping',
        description: "Replies with pong",
    })

    commands?.create({
        name: 'status',
        description: 'Get network status'
    })

    commands?.create({
        name: 'pool',
        description: 'Get pool status'
    })

    commands?.create({
        name: 'earn',
        description: 'Enter you hashrate in KH/s',
        options: [{
            name: 'hashrate',
            description: "Enter hashrate in kh/s",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
        },
        ]
    })

    console.log('The bot is ready 🥳')
})

let count = 0

function countCommands() {
    count++
}

function numberWithCommas(x) {
    return x.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function numberWithCommasToFixed(x) {
    return x.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) {
        return
    }

    const {commandName, options} = interaction

    if (commandName === 'ping') {
        console.log('🚨 /ping command received')
        interaction.reply({
            content: 'pong',
            ephemeral: true
        })
    }

    // HANDLE EARN COMMAND
    else if (commandName === 'earn') {
        console.log('🚨 Earn command received')
        const hashrate = options.getNumber('hashrate')
        let networkHashrate
        let currentHashrate
        let dailyReward

        await interaction.deferReply({
            ephemeral: false
        })

        await new Promise(resolve => setTimeout(resolve, 4000))

        await fetch('https://swenode.org/api/getinfo')
            .then(res => res.json())
            .then(data => {
                currentHashrate = data.hashrate / 1000
                networkHashrate = data.hashrate
            }).catch(async err => {
                console.log("Something worng with swenode, using backup => " + err)

                await fetch('https://blocksum.org/api/getinfo')
                    .then(res => res.json())
                    .then(data => {
                        currentHashrate = data.hashrate / 1000
                        networkHashrate = data.hashrate
                    })
            })

        await fetch('https://swepool.org/api/stats')
            .then(res => res.json())
            .then(data => {
                dailyReward = (data.lastblock.reward * 960) / 100000
            }).catch(async err => {
                console.log("Something worng with swepool, using backup => " + err)

                 await fetch('https://norpool.org/api/stats')
                    .then(res => res.json())
                    .then(data => {
                        dailyReward = (data.lastblock.reward * 960) / 100000
                        console.log(dailyReward)
                    })
            })

        const embed = new MessageEmbed()
            .setColor('#f69e25')
            .setTitle('Mining Stats <:Minershat:711146179572006913>')
            .setDescription('OBS. this is an estimate, will differ depending on network')
            .setAuthor({
                name: 'Kryptokrona',
                iconURL: 'https://letshash.it/static/coins/xkr.png',
                url: 'https://kryptokrona.org'
            })
            .setThumbnail('https://letshash.it/static/coins/xkr.png')
            .addFields(
                {name: '\u200B', value: '\u200B'},
                {name: 'Total hashrate', value: `${numberWithCommasToFixed(networkHashrate / 1000000)} MH/S`},
                {
                    name: 'Your share (%)',
                    value: `Your ${hashrate} KH/s is ${((hashrate / currentHashrate) * 100).toFixed(4)}% of the total hashrate`
                },
                {name: '\u200B', value: '\u200B'},
                {name: 'Mining Calculation 🧮', value: "-"},
                {
                    name: 'Daily',
                    value: `${numberWithCommasToFixed((hashrate / currentHashrate) * dailyReward)} XKR`,
                    inline: true
                },
                {
                    name: 'Weekly',
                    value: `${numberWithCommasToFixed(((hashrate / currentHashrate) * dailyReward) * 7)} XKR`,
                    inline: true
                },
                {
                    name: 'Monthly',
                    value: `${numberWithCommasToFixed((((hashrate / currentHashrate) * dailyReward) * 7) * 4)} XKR`,
                    inline: true
                },
            )
            .setFooter({text: 'Mining data provided by Swepool & Swenode'})
            .setTimestamp()


        interaction.editReply({embeds: [embed]})
        countCommands()
        console.log(`${count} - ✅ Mining message sent!`)
    }


    // HANDLE STATUS COMMAND
    else if (commandName === 'status') {
        console.log('🚨 Status command received')
        let hashrate
        let height
        let difficulty
        let supply
        let price
        let mcap
        let volume

        await interaction.deferReply({
            ephemeral: false
        })

        await new Promise(resolve => setTimeout(resolve, 3000))

        //Fetch Swenode
        await fetch('https://swenode.org/api/getinfo')
            .then(res => res.json())
            .then(data => {
                hashrate = data.hashrate
                height = data.height
                difficulty = data.difficulty
            }).catch( async err => {
                console.log("Something worng with swenode, using backup instead | " + err)
                //Fetch Swepool instead
                await fetch('https://blocksum.org/api/getinfo')
                    .then(res => res.json())
                    .then(data => {
                        hashrate = data.hashrate
                        height = data.height
                        difficulty = data.difficulty
                    })
            })

        //Fetch Coinpaprika
        await fetch('https://api.coinpaprika.com/v1/tickers/xkr-kryptokrona')
            .then(res => {
                if (!res.ok) {
                    throw Error('CoinPaprika not online?')
                }
                return res.json()
            })
            .then(data => {
                supply = data.total_supply
                price = data.quotes.USD.price
                volume = data.quotes.USD.volume_24h
                mcap = supply * price
            })
            .catch(err => console.log('Something went wrong when fetcing CoinPaprika'))

        const embed = new MessageEmbed()
            .setColor('#35ea6f')
            .setTitle('NETWORK STATUS <:godspeed:781930967077093377> ')
            .setDescription('Here some stats for ya')
            .setAuthor({
                name: 'Kryptokrona',
                iconURL: 'https://letshash.it/static/coins/xkr.png',
                url: 'https://kryptokrona.org'
            })
            .setThumbnail('https://letshash.it/static/coins/xkr.png')
            .addFields(
                {name: '\u200B', value: '\u200B'},
                {name: 'Supply 💰', value: `${numberWithCommas(supply)} XKR`},
                {name: '\u200B', value: '\u200B'},
                {
                    name: 'Hashrate <:Minershat:711146179572006913>',
                    value: `${numberWithCommasToFixed(hashrate / 1000000)} MH/S`,
                    inline: true
                },
                {name: ' Height 📦', value: ` ${numberWithCommas(height)}`, inline: true},
                {name: ' Difficulty  🗻', value: ` ${numberWithCommas(difficulty / 1000000)} M`, inline: true},
                {name: '\u200B', value: '\u200B'},
                {name: 'Price 🏷', value: `$${price.toFixed(7)}`, inline: true},
                {name: ' Volume 🔊', value: ` $${numberWithCommasToFixed(volume)}`, inline: true},
                {name: ' MCAP 🤑', value: ` $${numberWithCommasToFixed(mcap)}`, inline: true},
                {name: '\u200B', value: '\u200B'},
            )
            .setFooter({text: 'Market data provided by CoinPaprika'})
            .setTimestamp()

        interaction.editReply({embeds: [embed]})
        countCommands()
        console.log(`${count} - ✅ Status message sent!`)
    }

    // HANDLE POOL COMMAND
    else if (commandName === 'pool') {
        console.log('🚨 Pool command received')

        await interaction.deferReply({
            ephemeral: false
        })

        await new Promise(resolve => setTimeout(resolve, 3000))

        let poolAPI = [
            {"name": "Swepool", "url": "https://swepool.org/api/stats"},
            {"name": "Norpool", "url": "https://norpool.org/api/stats"},
            {"name": "Drakpool", "url": "https://drakpool.com/api/stats"}
        ]


        let poolList = []

        for (const pool of poolAPI) {
            await fetch(pool.url)
                .then(res => res.json())
                .then(data => {
                    let hashrate = (data.pool.hashrate + data.pool.hashrateSolo) / 1000
                    let miners = data.pool.miners + data.pool.minersSolo
                    let poolStats = {"name": pool.name, "miners": miners, "hashrate": hashrate}
                    poolList.push(poolStats)
                })
        }

        poolList.sort((a, b) => parseFloat(b.hashrate) - parseFloat(a.hashrate))

        const embed = new MessageEmbed()
            .setColor('#35b4ea')
            .setTitle('POOL STATS')
            .setDescription(`Here's some pool stats`)
            .setAuthor({
                name: 'Kryptokrona',
                iconURL: 'https://letshash.it/static/coins/xkr.png',
                url: 'https://kryptokrona.org'
            })
            .setThumbnail('https://letshash.it/static/coins/xkr.png')
            .addFields(
                {name: '\u200B', value: '\u200B'},
                {
                    name: 'Pools', value: `
                #   Name    Miners  Hashrate
                #1 ${poolList[0].name}      ${poolList[0].miners}       ${poolList[0].hashrate} KH/S
                #2 ${poolList[1].name}      ${poolList[1].miners}       ${poolList[1].hashrate} KH/S
                #3 ${poolList[2].name}      ${poolList[2].miners}       ${poolList[2].hashrate} KH/S
                `
                },
                {name: '\u200B', value: '\u200B'},
            )
            .setFooter({text: 'Done'})
            .setTimestamp()

        interaction.editReply({embeds: [embed]})
        countCommands()
        console.log(`${count} - ✅ Pool message sent!`)
    }
})

client.login(process.env.TOKEN)