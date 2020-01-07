"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class ControllerError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.ControllerError = ControllerError;
class ActionNotAllowedError extends ControllerError {
    constructor(message) {
        super(message);
        this.code = http_status_codes_1.default.BAD_REQUEST;
    }
}
exports.ActionNotAllowedError = ActionNotAllowedError;
class NotFoundError extends ControllerError {
    constructor(message) {
        super(message);
        this.code = http_status_codes_1.default.NOT_FOUND;
    }
}
exports.NotFoundError = NotFoundError;
//# sourceMappingURL=controller.errors.js.map