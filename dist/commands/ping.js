"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wokcommands_1 = require("wokcommands");
exports.default = {
    description: "Ping pong command",
    // Create a legacy and slash command
    type: wokcommands_1.CommandType.SLASH,
    // Invoked when a user runs the ping command
    callback: () => {
        return {
            content: "Can you please stop? Like wtf.. I'm online ok?",
        };
    },
};
//# sourceMappingURL=ping.js.map