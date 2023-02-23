"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const prisma_1 = __importDefault(require("../utils/prisma"));
const tokenService_1 = require("./tokenService");
const UserDTO_1 = require("../dtos/UserDTO");
const ApiError_1 = require("../exceptions/ApiError");
class UserService {
    register(email, name, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidate = yield prisma_1.default.user.findUnique({
                where: {
                    email,
                },
            });
            if (candidate) {
                throw ApiError_1.ApiError.BadRequest("Email already in use");
            }
            const user = yield prisma_1.default.user.create({
                data: { email, name, password: bcrypt_1.default.hashSync(password, 12) },
            });
            const userDTO = new UserDTO_1.UserDTO(user);
            const jti = (0, uuid_1.v4)();
            const tokens = tokenService_1.tokenService.generateTokens(Object.assign({}, userDTO), jti);
            yield tokenService_1.tokenService.saveToken(userDTO.id, tokens.refreshToken, jti);
            return Object.assign(Object.assign({}, tokens), { user: Object.assign({}, userDTO) });
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma_1.default.user.findUnique({
                where: {
                    email,
                },
            });
            if (!user) {
                throw ApiError_1.ApiError.BadRequest("User not found");
            }
            const isPassEquals = yield bcrypt_1.default.compare(password, user.password);
            if (!isPassEquals) {
                throw ApiError_1.ApiError.BadRequest("Incorrect password");
            }
            const userDTO = new UserDTO_1.UserDTO(user);
            const jti = (0, uuid_1.v4)();
            const tokens = tokenService_1.tokenService.generateTokens(Object.assign({}, userDTO), jti);
            yield tokenService_1.tokenService.saveToken(userDTO.id, tokens.refreshToken, jti);
            return Object.assign(Object.assign({}, tokens), { user: Object.assign({}, userDTO) });
        });
    }
    logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield tokenService_1.tokenService.removeToken(refreshToken);
            return token;
        });
    }
    refresh(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = tokenService_1.tokenService.validateRefreshToken(refreshToken);
            if (!userData) {
                throw ApiError_1.ApiError.Unauthorized();
            }
            console.log("==============", userData);
            const tokenFromDb = yield tokenService_1.tokenService.findToken(userData === null || userData === void 0 ? void 0 : userData.jti);
            if (!tokenFromDb) {
                throw ApiError_1.ApiError.Unauthorized();
            }
            const user = yield prisma_1.default.user.findUnique({ where: { id: userData.id } });
            const userDTO = new UserDTO_1.UserDTO(user);
            const jti = (0, uuid_1.v4)();
            const tokens = tokenService_1.tokenService.generateTokens(Object.assign({}, userDTO), jti);
            yield tokenService_1.tokenService.saveToken(userDTO.id, tokens.refreshToken, jti);
            return Object.assign(Object.assign({}, tokens), { user: Object.assign({}, userDTO) });
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield prisma_1.default.user.findMany();
            return users;
        });
    }
}
exports.userService = new UserService();
