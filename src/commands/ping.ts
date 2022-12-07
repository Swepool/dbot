import { CommandObject, CommandType } from 'wokcommands'

export default {
    description: "Ping pong command",

    // Create a legacy and slash command
    type: CommandType.SLASH,

    // Invoked when a user runs the ping command
    callback: () => {
        return {
            content: "Can you please stop? Like wtf.. I'm online ok?",
        }
    },
} as CommandObject