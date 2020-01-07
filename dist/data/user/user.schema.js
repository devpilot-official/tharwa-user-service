"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_autopopulate_1 = __importDefault(require("mongoose-autopopulate"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const base_1 = require("../base");
const env_1 = __importDefault(require("@app/common/config/env"));
exports.UserSchema = base_1.SchemaFactory({
    email: Object.assign(Object.assign({}, base_1.trimmedLowercaseString), { required: true, unique: true }),
    first_name: Object.assign(Object.assign({}, base_1.trimmedString), { required: true }),
    last_name: Object.assign(Object.assign({}, base_1.trimmedString), { required: true }),
    password: Object.assign(Object.assign({}, base_1.trimmedString), { select: false })
}).plugin(mongoose_autopopulate_1.default);
/**
 * Mongoose Pre-save hook used to hash passwords for new users
 */
exports.UserSchema.pre('save', async function () {
    const user = this;
    if (!user.isNew || !user.password)
        return;
    const hash = await bcrypt_1.default.hash(user.password, env_1.default.salt_rounds);
    user.password = hash;
});
/**
 * Document method used to check if a plain text password is the same as a hashed password
 * @param plainText Plain text to be hashed and set as the paswword
 */
exports.UserSchema.method('isPasswordValid', async function (plainText) {
    const user = this;
    const result = await bcrypt_1.default.compare(plainText, user.password);
    return result;
});
/**
 * Document method used to change an user's password.
 * @param plainText Plain text to be hashed and set as the paswword
 */
exports.UserSchema.method('updatePassword', async function (plainText) {
    const user = this;
    const hash = await bcrypt_1.default.hash(plainText, env_1.default.salt_rounds);
    user.password = hash;
    return user.save();
});
//# sourceMappingURL=user.schema.js.map