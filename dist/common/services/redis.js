"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = __importDefault(require("redis"));
const util_1 = require("util");
const env_1 = __importDefault(require("../config/env"));
const logger_1 = __importDefault(require("./logger/logger"));
class RedisService {
    constructor() {
        const productionOrStagingEnvironment = ['production', 'staging'].includes(env_1.default.app_env);
        this.redis = redis_1.default.createClient(Object.assign({ url: env_1.default.redis_url }, (productionOrStagingEnvironment && {
            password: String(env_1.default.redis_password),
        })));
        const commands = [
            'del',
            'expire',
            'expireat',
            'incrby',
            'hdel',
            'hget',
            'hgetall',
            'hset',
            'set',
            'get',
            'quit',
        ];
        // Promisify all the specified commands
        commands.forEach(command => {
            this[command] = util_1.promisify(this.redis[command]).bind(this.redis);
        });
        this.redis.on('ready', async () => {
            logger_1.default.message('🐳  Redis Connected!');
        });
        this.redis.on('error', err => {
            logger_1.default.error(err, 'An error occured with the Redis client.');
        });
    }
}
exports.RedisService = RedisService;
exports.default = new RedisService();
//# sourceMappingURL=redis.js.map