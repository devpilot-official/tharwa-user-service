"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../base");
const user_schema_1 = require("./user.schema");
class UserRepository extends base_1.BaseRepository {
    constructor() {
        super('Admin', user_schema_1.UserSchema);
    }
}
exports.UserRepo = new UserRepository();
//# sourceMappingURL=user.repo.js.map