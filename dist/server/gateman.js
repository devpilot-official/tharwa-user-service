"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gateman_1 = require("@random-guys/gateman");
const redis_1 = __importDefault(require("@app/common/services/redis"));
const env_1 = __importDefault(require("@app/common/config/env"));
const iris_1 = __importDefault(require("@random-guys/iris"));
const authScheme = 'Tharwa';
iris_1.default.bootstrap(env_1.default.service_name, authScheme);
exports.default = new gateman_1.Gateman({
    service: env_1.default.service_name,
    authScheme,
    redis: redis_1.default,
    secret: env_1.default.gateman_key
});
//# sourceMappingURL=gateman.js.map