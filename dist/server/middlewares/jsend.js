"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class JSendMiddleware {
    constructor(res) {
        this.res = res;
    }
    success(data) {
        this.res.json({
            status: 'success',
            data,
        });
    }
    fail(data) {
        this.res.status(http_status_codes_1.default.EXPECTATION_FAILED).json({
            status: 'fail',
            data,
        });
    }
    error(data, message, code) {
        const httpCode = code || http_status_codes_1.default.INTERNAL_SERVER_ERROR;
        this.res.status(httpCode).json({
            status: 'error',
            data,
            message,
            code: httpCode,
        });
    }
}
exports.default = (req, res, next) => {
    res.jSend = new JSendMiddleware(res);
    next();
};
//# sourceMappingURL=jsend.js.map