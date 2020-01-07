"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const util_1 = require("util");
/**
 * Generates random bytes of a specified length and returns a buffer
 */
exports.generateRandomBytes = util_1.promisify(crypto_1.default.randomBytes);
//# sourceMappingURL=miscellaneous.js.map