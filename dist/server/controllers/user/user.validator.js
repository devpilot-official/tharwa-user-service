"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
exports.Login = {
    email: joi_1.default
        .string()
        .email()
        .lowercase()
        .required(),
    password: joi_1.default.string().required()
};
exports.signup = {
    password: joi_1.default
        .string()
        .trim()
        .required(),
    first_name: joi_1.default
        .string()
        .trim()
        .lowercase()
        .required(),
    last_name: joi_1.default
        .string()
        .trim()
        .lowercase()
        .required(),
    email: joi_1.default
        .string()
        .email()
        .trim()
        .lowercase()
        .required()
};
//# sourceMappingURL=user.validator.js.map