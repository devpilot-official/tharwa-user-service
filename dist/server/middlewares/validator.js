"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const joi_1 = __importDefault(require("joi"));
const logger_1 = __importDefault(require("@app/common/services/logger/logger"));
const parseError = (error) => {
    const parsedError = error.details.reduce((acc, curr) => (Object.assign(Object.assign({}, acc), { [curr.context.key]: curr.message })), {});
    return parsedError;
};
const validate = (data, schema) => {
    const { error, value } = joi_1.default.validate(data, schema, {
        abortEarly: false,
        stripUnknown: true,
    });
    if (!error)
        return {
            err: null,
            value: value,
        };
    return {
        err: parseError(error),
        value: null,
    };
};
exports.default = (schema, context = 'body') => {
    return (req, res, next) => {
        const { err, value } = validate(req[context], schema);
        if (!err) {
            req[context] = value;
            return next();
        }
        res.jSend.error(err, 'One or more validation errors occured', http_status_codes_1.default.UNPROCESSABLE_ENTITY);
        logger_1.default.logAPIError(req, res, err);
    };
};
//# sourceMappingURL=validator.js.map