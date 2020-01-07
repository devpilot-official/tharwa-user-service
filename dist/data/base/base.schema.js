"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const _1 = require(".");
exports.SchemaFactory = (schemaFields, options) => {
    if (!schemaFields || Object.keys(schemaFields).length === 0) {
        throw new Error('Please specify schemaFields');
    }
    return new mongoose_1.Schema(Object.assign(Object.assign({}, schemaFields), { _id: Object.assign({}, _1.uuid), deleted_at: { type: mongoose_1.SchemaTypes.Date } }), Object.assign(Object.assign(Object.assign(Object.assign({}, options), _1.readMapper), _1.timestamps), { 
        // @ts-ignore
        selectPopulatedPaths: false }));
};
//# sourceMappingURL=base.schema.js.map