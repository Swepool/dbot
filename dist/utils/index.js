"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.numberWithCommas = void 0;
function numberWithCommas(input, decimals = 0) {
    return input.toFixed(decimals).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
exports.numberWithCommas = numberWithCommas;
//# sourceMappingURL=index.js.map