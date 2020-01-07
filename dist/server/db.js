"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = __importDefault(require("@app/common/config/env"));
/**
 * Database class. Handles MongoDB database connections.
 */
class DB {
    /**
     * Connects to a MongoDB server and subsequently opens a MongoDB connection
     */
    async connect() {
        const productionOrStagingEnvironment = ['production', 'staging'].includes(env_1.default.app_env);
        await mongoose_1.default.connect(env_1.default.mongodb_url, Object.assign({ useNewUrlParser: true, useCreateIndex: true, poolSize: 10 }, (productionOrStagingEnvironment && {
            user: env_1.default.mongodb_username,
            pass: env_1.default.mongodb_password,
        })));
        this.connection = mongoose_1.default.connection;
    }
    /**
     * Closes all connections in the Mongoose connection pool:
     */
    async disconnect() {
        await mongoose_1.default.disconnect();
    }
}
exports.DB = DB;
exports.default = new DB();
//# sourceMappingURL=db.js.map