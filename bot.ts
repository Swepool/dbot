import {Client, IntentsBitField, Partials, Message} from 'discord.js'
import dotenv from 'dotenv'
import * as path from "path";
import WOK from'wokcommands'

dotenv.config()

// Declare your intents (What you want access to)
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.MessageContent,
    ],
    partials: [Partials.Channel],
});

client.on('ready', () => {

    new WOK({
        client,
        commandsDir: path.join(__dirname, 'commands')
    })

    console.log('The bot is ready 🥳')
})


client.login(process.env.TOKEN)
