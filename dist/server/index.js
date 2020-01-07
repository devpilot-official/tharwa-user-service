"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import metadata for es7 decorators support
require("reflect-metadata");
// allow creation of aliases for directories
require("module-alias/register");
const http_1 = __importDefault(require("http"));
const eventbus_1 = require("@random-guys/eventbus");
const env_1 = __importDefault(require("@app/common/config/env"));
const logger_1 = __importDefault(require("@app/common/services/logger/logger"));
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./db"));
const start = async () => {
    try {
        const app = new app_1.default();
        const appServer = app.build();
        const httpServer = http_1.default.createServer(appServer);
        await db_1.default.connect();
        logger_1.default.message('📦  MongoDB Connected!');
        await eventbus_1.publisher.init(env_1.default.amqp_url);
        logger_1.default.message('🐢 Event Bus Publisher connected!');
        httpServer.listen(env_1.default.port);
        httpServer.on('listening', () => logger_1.default.message(`🚀  ${env_1.default.service_name} running in ${env_1.default.app_env}. Listening on ` +
            env_1.default.port));
    }
    catch (err) {
        logger_1.default.error(err, 'Fatal server error');
    }
};
start();
//# sourceMappingURL=index.js.map