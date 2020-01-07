"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RepositoryError extends Error {
    constructor(message) {
        super(message);
    }
}
class DuplicateModelError extends RepositoryError {
    constructor(message) {
        super(message);
    }
}
exports.DuplicateModelError = DuplicateModelError;
class ModelNotFoundError extends RepositoryError {
    constructor(message) {
        super(message);
    }
}
exports.ModelNotFoundError = ModelNotFoundError;
//# sourceMappingURL=repo.errors.js.map