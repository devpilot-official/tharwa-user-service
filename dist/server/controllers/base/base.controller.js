"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const lodash_1 = __importDefault(require("lodash"));
const base_1 = require("@app/data/base");
const logger_1 = __importDefault(require("@app/common/services/logger/logger"));
const iris_1 = require("@random-guys/iris");
let BaseController = class BaseController {
    /*
     * Determines the HTTP status code of an error
     * @param err Error object
     */
    getHTTPErrorCode(err) {
        // check if error code exists and is a valid HTTP code.
        if (err.code >= 100 && err.code < 600)
            return err.code;
        if (err instanceof base_1.ModelNotFoundError)
            return http_status_codes_1.default.NOT_FOUND;
        if (err instanceof base_1.DuplicateModelError)
            return http_status_codes_1.default.BAD_REQUEST;
        return http_status_codes_1.default.BAD_REQUEST;
    }
    /**
     * Handles operation success and sends a HTTP response
     * @param req Express request
     * @param res Express response
     * @param data Success data
     */
    handleSuccess(req, res, data) {
        res.jSend.success(data);
        logger_1.default.logAPIResponse(req, res);
    }
    /**
     * Handles operation error, sends a HTTP response and logs the error.
     * @param req Express request
     * @param res Express response
     * @param error Error object
     * @param message Optional error message. Useful for hiding internal errors from clients.
     */
    handleError(req, res, err, message) {
        /**
         * Useful when we call an asynchrous function that might throw
         * after we've sent a response to client
         */
        if (res.headersSent)
            return logger_1.default.error(err);
        const irisErrormessage = err instanceof iris_1.IrisAPIError && err.data.message
            ? err.data.message
            : undefined;
        const errorMessage = message || (irisErrormessage || err.message);
        res.jSend.error(null, errorMessage, this.getHTTPErrorCode(err));
        logger_1.default.logAPIError(req, res, err);
    }
    getPaginationOptions(query) {
        return lodash_1.default.pick(query, ['page', 'per_page', 'projections', 'sort']);
    }
};
BaseController = __decorate([
    inversify_1.injectable()
], BaseController);
exports.BaseController = BaseController;
//# sourceMappingURL=base.controller.js.map