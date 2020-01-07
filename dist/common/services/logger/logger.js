"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bunyan_1 = __importDefault(require("bunyan"));
const serializers_1 = require("./serializers");
const env_1 = __importDefault(require("@app/common/config/env"));
class Logger {
    constructor(name = env_1.default.service_name) {
        this.log = bunyan_1.default.createLogger({
            name,
            serializers: {
                err: serializers_1.errSerializer,
                res: serializers_1.resSerializer,
                req: serializers_1.reqSerializer,
            },
        });
        /**
         * Overrides the default bunyan log fields and formats it into a format Logstash/Elastic Search
         * understands (for uniform indexing) in production or staging.
         */
        if (['production', 'staging'].includes(env_1.default.app_env)) {
            // @ts-ignore
            this.log._emit = (rec, noemit) => {
                rec.message = rec.msg;
                rec.timestamp = rec.time;
                delete rec.msg;
                delete rec.time;
                delete rec.v;
                //@ts-ignore
                // Call the default bunyan emit function with the modified log record
                bunyan_1.default.prototype._emit.call(this.log, rec, noemit);
            };
        }
    }
    /**
     * Logs an error along with information describing the
     * error.
     * @param err Error object
     * @param message Additional information about the error.
     */
    error(err, errInfo) {
        if (typeof errInfo === 'string')
            errInfo = { info: errInfo };
        this.log.error(Object.assign({ err }, errInfo));
    }
    /**
     * Logs arbitrary data
     * @param message Arbitrary data to be logged
     */
    message(message) {
        this.log.info(message);
    }
    /**
     * Logs an incoming HTTP request
     * @param req Express request
     */
    logAPIRequest(req) {
        this.log.info({ req });
    }
    /**
     * Logs an outgoing HTTP response
     * @param req Express request
     * @param res Express responser
     */
    logAPIResponse(req, res) {
        this.log.info({
            res,
            req: {
                id: req.id,
            },
        });
    }
    /**
     * Logs an error that occured during an operation
     * initiated via a HTTP request
     * @param req Express request
     * @param res Express responser
     * @param err Error object
     */
    logAPIError(req, res, err) {
        this.log.error({
            err,
            res,
            req: {
                id: req.id,
            },
        });
    }
}
exports.default = new Logger();
//# sourceMappingURL=logger.js.map