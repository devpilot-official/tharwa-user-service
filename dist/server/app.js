"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inversify_express_utils_1 = require("inversify-express-utils");
const response_time_1 = __importDefault(require("response-time"));
const express_request_id_1 = __importDefault(require("express-request-id"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const ioc_1 = __importDefault(require("@app/common/config/ioc"));
const env_1 = __importDefault(require("../common/config/env"));
const requestLogger_1 = __importDefault(require("./middlewares/requestLogger"));
const jsend_1 = __importDefault(require("./middlewares/jsend"));
class App {
    constructor() {
        const serverOptions = {
            rootPath: env_1.default.api_version,
        };
        this.server = new inversify_express_utils_1.InversifyExpressServer(ioc_1.default, null, serverOptions);
        this.registerMiddlewares();
        this.registerHandlers();
    }
    /**
     * Registers middlewares on the application server
     */
    registerMiddlewares() {
        this.server.setConfig((app) => {
            app.use(express_1.default.json());
            app.use(express_1.default.urlencoded({ extended: false }));
            app.disable('x-powered-by');
            app.use(helmet_1.default());
            app.use(cors_1.default());
            app.use(response_time_1.default());
            app.use(express_request_id_1.default());
            app.use(requestLogger_1.default);
            app.use(jsend_1.default);
        });
    }
    /**
     * Registers utility handlers
     */
    registerHandlers() {
        this.server.setErrorConfig((app) => {
            app.get('/', (req, res) => {
                res.status(200).json({ status: 'UP' });
            });
            app.use((req, res, next) => {
                res.status(404).send("Whoops! Route doesn't exist.");
            });
        });
    }
    /**
     * Applies all routes and configuration to the server, returning the express application server.
     */
    build() {
        const app = this.server.build();
        return app;
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map