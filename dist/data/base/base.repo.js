"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const _1 = require(".");
class BaseRepository {
    constructor(name, schema) {
        this.name = name;
        /**
         * checks if the archived argument is either undefined
         * or passed as a false string in the cause of query params, and
         * converts it to a boolean.
         * @param archived string or boolean archived option
         */
        this.convertArchived = archived => archived === undefined || archived === 'false' ? false : true;
        /**
         * Converts a passed condition argument to a query
         * @param condition string or object condition
         */
        this.getQuery = (condition) => {
            return typeof condition === 'string'
                ? { _id: condition }
                : Object.assign({}, condition);
        };
        this.model = mongoose_1.default.model(name, schema);
    }
    /**
     * Creates one or more documets.
     */
    create(attributes) {
        return new Promise((resolve, reject) => {
            this.model.create(attributes, (err, result) => {
                if (err && err.code === 11000)
                    return reject(new _1.DuplicateModelError(`${this.name} exists already`));
                if (err)
                    return reject(err);
                resolve(result);
            });
        });
    }
    /**
     * Finds a document by it's id
     * @param _id
     * @param projections
     * @param archived
     */
    byID(_id, projections, archived) {
        return new Promise((resolve, reject) => {
            archived = this.convertArchived(archived);
            this.model
                .findOne(Object.assign({ _id }, (!archived
                ? { deleted_at: undefined }
                : { deleted_at: { $ne: undefined } })))
                .select(projections)
                .exec((err, result) => {
                if (err)
                    return reject(err);
                if (!result)
                    return reject(new _1.ModelNotFoundError(`${this.name} not found`));
                resolve(result);
            });
        });
    }
    /**
     * Finds a document by an object query.
     * @param query
     * @param projections
     * @param archived
     */
    byQuery(query, projections, archived) {
        archived = this.convertArchived(archived);
        return new Promise((resolve, reject) => {
            this.model
                .findOne(Object.assign(Object.assign({}, query), (!archived
                ? { deleted_at: undefined }
                : { deleted_at: { $ne: undefined } })))
                .select(projections)
                .exec((err, result) => {
                if (err)
                    return reject(err);
                if (!result)
                    return reject(new _1.ModelNotFoundError(`${this.name} not found`));
                resolve(result);
            });
        });
    }
    /**
     * Finds all documents that match a query
     * @param query
     */
    all(query) {
        return new Promise((resolve, reject) => {
            const sort = query.sort || 'created_at';
            this.model
                .find(Object.assign(Object.assign({}, query.conditions), { deleted_at: undefined }))
                .select(query.projections)
                .sort(sort)
                .exec((err, result) => {
                if (err)
                    return reject(err);
                resolve(result);
            });
        });
    }
    /**
     * Same as `all()` but returns paginated results.
     * @param query Query
     */
    list(query) {
        return new Promise((resolve, reject) => {
            const _page = Number(query.page);
            const page = _page ? _page - 1 : 0;
            const per_page = Number(query.per_page) || 20;
            const offset = page * per_page;
            const sort = query.sort || 'created_at';
            const archived = this.convertArchived(query.archived);
            this.model
                .find(Object.assign(Object.assign({}, query.conditions), (!archived
                ? { deleted_at: undefined }
                : { deleted_at: { $ne: undefined } })))
                .limit(per_page)
                .select(query.projections)
                .skip(offset)
                .sort(sort)
                .exec((err, result) => {
                if (err)
                    return reject(err);
                const queryResult = {
                    page: page + 1,
                    per_page,
                    sort,
                    result,
                };
                resolve(queryResult);
            });
        });
    }
    /**
     * Updates a single document that matches a particular condition.
     * Triggers mongoose `save` hooks.
     * @param condition
     * @param update
     */
    update(condition, update) {
        const query = this.getQuery(condition);
        return new Promise((resolve, reject) => {
            this.model.findOne(query, (err, result) => {
                if (err)
                    return reject(err);
                if (!result)
                    return reject(new _1.ModelNotFoundError(`${this.name} not found`));
                result.set(update);
                result.save((err, updatedDocument) => {
                    if (err)
                        return reject(err);
                    resolve(updatedDocument);
                });
            });
        });
    }
    /**
     * Allows the user of atomic operators such as $inc in updates.
     * Note: It does not trigger mongoose `save` hooks.
     * @param condition Query condition to match against documents
     * @param update The document update
     */
    updateWithOperators(condition, update) {
        const query = this.getQuery(condition);
        return new Promise((resolve, reject) => {
            this.model.findOneAndUpdate(query, update, { new: true }, (err, result) => {
                if (err)
                    return reject(err);
                if (!result)
                    return reject(new _1.ModelNotFoundError(`${this.name} not found`));
                resolve(result);
            });
        });
    }
    /**
     * Updates multiple documents that match a query
     * @param condition
     * @param update
     */
    updateAll(condition, update) {
        const query = this.getQuery(condition);
        return new Promise((resolve, reject) => {
            this.model.updateMany(query, update, (err, result) => {
                if (err)
                    return reject(err);
                resolve(result);
            });
        });
    }
    /**
     * Soft deletes a document by created `deleted_at` field in the document and setting it to true.
     * @param condition
     */
    remove(condition) {
        return new Promise((resolve, reject) => {
            const query = this.getQuery(condition);
            this.model.findOneAndUpdate(query, {
                deleted_at: new Date(),
            }, {
                new: true,
            }, (err, result) => {
                if (err)
                    return reject(err);
                if (!result)
                    return reject(new _1.ModelNotFoundError(`${this.name} not found`));
                resolve(result);
            });
        });
    }
    /**
     * Permanently deletes a document by removing it from the collection(DB)
     * @param condition
     */
    destroy(condition) {
        return new Promise((resolve, reject) => {
            const query = this.getQuery(condition);
            this.model.findOneAndDelete(query, (err, result) => {
                if (err)
                    return reject(err);
                if (!result)
                    return reject(new _1.ModelNotFoundError(`${this.name} not found`));
                resolve(result);
            });
        });
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base.repo.js.map