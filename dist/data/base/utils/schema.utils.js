"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const v4_1 = __importDefault(require("uuid/v4"));
const mongoose_1 = require("mongoose");
/**
 * Removes _id field in subdocuments and allows virtual fields to be returned
 */
exports.readMapper = {
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: (doc, ret, options) => {
            delete ret._id;
            if (ret.password)
                delete ret.password;
            return ret;
        },
    },
};
/**
 * Defines timestamps fields in a schema
 */
exports.timestamps = {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
};
/**
 * Replaces the default mongoose id with a uuid string
 */
exports.uuid = {
    type: mongoose_1.SchemaTypes.String,
    default: v4_1.default,
};
/**
 * Defines a schema type with a lowercased trimmed string
 */
exports.trimmedLowercaseString = {
    type: mongoose_1.SchemaTypes.String,
    trim: true,
    lowercase: true,
};
/**
 * Defines a schema type with a trimmed string
 */
exports.trimmedString = {
    type: mongoose_1.SchemaTypes.String,
    trim: true,
};
/**
 * Defines a schema type with a lowercased string
 */
exports.lowercaseString = {
    type: mongoose_1.SchemaTypes.String,
    lowercase: true,
};
//# sourceMappingURL=schema.utils.js.map