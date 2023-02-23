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
exports.tokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../utils/prisma"));
class TokenService {
    generateTokens(payload, jti) {
        const accessToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_ACCESS_SECRET, {
            expiresIn: "30m",
        });
        const refreshToken = jsonwebtoken_1.default.sign(Object.assign(Object.assign({}, payload), { jti }), process.env.JWT_REFRESH_SECRET, {
            expiresIn: "15d",
        });
        return { accessToken, refreshToken };
    }
    validateAccessToken(token) {
        try {
            const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
            return payload;
        }
        catch (error) {
            return null;
        }
    }
    validateRefreshToken(token) {
        try {
            const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
            return payload;
        }
        catch (error) {
            return null;
        }
    }
    saveToken(userId, refreshToken, jti) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenData = yield prisma_1.default.refreshToken.findFirst({
                where: { userId },
            });
            if (tokenData) {
                return yield prisma_1.default.refreshToken.update({
                    where: { id: tokenData.id },
                    data: { id: jti, token: refreshToken },
                });
            }
            console.log("save Token", jti);
            const token = yield prisma_1.default.refreshToken.create({
                data: { id: jti, token: refreshToken, userId },
            });
            return token;
        });
    }
    removeToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            console.log("PAYLOAD===========", payload);
            const tokenData = yield prisma_1.default.refreshToken.delete({
                where: { id: payload.jti },
            });
            return tokenData;
        });
    }
    findToken(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.refreshToken.findUnique({ where: { id } });
        });
    }
}
exports.tokenService = new TokenService();
