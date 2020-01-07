"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_express_utils_1 = require("inversify-express-utils");
const base_1 = require("../base");
const validator_1 = __importDefault(require("@app/server/middlewares/validator"));
const user_validator_1 = require("./user.validator");
const user_1 = require("@app/data/user");
const gateman_1 = __importDefault(require("@app/server/gateman"));
const services_1 = require("@app/server/services");
let UserController = class UserController extends base_1.BaseController {
    /**
     * Gets a user's profile
     */
    async getProfile(req, res) {
        try {
            this.handleSuccess(req, res, await user_1.UserRepo.byID(req.user));
        }
        catch (err) {
            this.handleError(req, res, err);
        }
    }
    /**
     * Creates a new user
     */
    async signup(req, res, body) {
        try {
            this.handleSuccess(req, res, await user_1.UserRepo.create(body));
        }
        catch (err) {
            this.handleError(req, res, err);
        }
    }
    /**
     * Logs in a user
     */
    async login(req, res, body) {
        try {
            this.handleSuccess(req, res, await services_1.AuthService.login(body));
        }
        catch (err) {
            this.handleError(req, res, err);
        }
    }
};
__decorate([
    inversify_express_utils_1.httpGet('/', gateman_1.default.guard()),
    __param(0, inversify_express_utils_1.request()), __param(1, inversify_express_utils_1.response()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getProfile", null);
__decorate([
    inversify_express_utils_1.httpPost('/', validator_1.default(user_validator_1.signup)),
    __param(0, inversify_express_utils_1.request()),
    __param(1, inversify_express_utils_1.response()),
    __param(2, inversify_express_utils_1.requestBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "signup", null);
__decorate([
    inversify_express_utils_1.httpPost('/login', validator_1.default(user_validator_1.Login)),
    __param(0, inversify_express_utils_1.request()),
    __param(1, inversify_express_utils_1.response()),
    __param(2, inversify_express_utils_1.requestBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
UserController = __decorate([
    inversify_express_utils_1.controller('/user')
], UserController);
exports.default = UserController;
//# sourceMappingURL=user.controller.js.map