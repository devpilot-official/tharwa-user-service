"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bunyan_1 = __importDefault(require("bunyan"));
/**
 * Prevents passwords, credit card details etc from being logged.
 * @param body HTTP request body
 */
const removeSensitiveData = (_a) => {
    var { password } = _a, body = __rest(_a, ["password"]);
    return body;
};
/**
 * Serializes an Express request for Bunyan logging
 * @param req Express request object
 */
exports.reqSerializer = (req) => {
    if (!req || !req.connection)
        return req;
    return Object.assign({ method: req.method, url: req.url, headers: req.headers, origin_service: req.headers['x-origin-service'], remoteAddress: req.connection.remoteAddress, remotePort: req.connection.remotePort, id: req.id }, (req.body || Object.keys(req.body).length !== 0
        ? { body: removeSensitiveData(req.body) }
        : undefined));
};
/**
 * Serializes an Express response for Bunyan logging
 * @param res Express response object
 */
exports.resSerializer = (res) => {
    if (!res || !res.statusCode)
        return res;
    return {
        statusCode: res.statusCode,
        // @ts-ignore
        headers: res._headers,
    };
};
/**
 * Extends the standard bunyan error serializer and allows custom fields to be added to the error log
 */
exports.errSerializer = (err) => {
    const { url, data, req, response } = err;
    const bunyanSanitizedError = bunyan_1.default.stdSerializers.err(err);
    return Object.assign(Object.assign(Object.assign({}, bunyanSanitizedError), { url,
        data,
        req }), (response &&
        typeof response === 'object' && {
        response: {
            config: response.config,
            data: response.data,
            status: response.status,
        },
    }));
};
//# sourceMappingURL=serializers.js.map