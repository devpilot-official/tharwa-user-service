"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("@app/common/services/logger/logger"));
/**
 * Express Middleware that logs incoming HTTP requests.
 */
exports.default = (req, res, next) => {
    // If the request is from K8s don't log it (for now) to avoid too much chatter in the logs
    if (/kube-probe/i.test(req.headers['user-agent']))
        return next();
    logger_1.default.logAPIRequest(req);
    next();
};
//# sourceMappingURL=requestLogger.js.map