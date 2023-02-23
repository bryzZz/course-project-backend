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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const express_validator_1 = require("express-validator");
const userService_1 = require("../service/userService");
const ApiError_1 = require("../exceptions/ApiError");
class UserController {
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return next(ApiError_1.ApiError.BadRequest("Validation error", errors.array()));
                }
                const { email, name, password } = req.body;
                const userData = yield userService_1.userService.register(email, name, password);
                res.cookie("refresh_token", userData.refreshToken, {
                    maxAge: 15 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    sameSite: true,
                });
                return res.json(userData);
            }
            catch (error) {
                next(error);
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const userData = yield userService_1.userService.login(email, password);
                res.cookie("refresh_token", userData.refreshToken, {
                    maxAge: 15 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    sameSite: true,
                });
                return res.json(userData);
            }
            catch (error) {
                next(error);
            }
        });
    }
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = req.cookies.refresh_token;
                const token = yield userService_1.userService.logout(refreshToken);
                res.clearCookie("refresh_token");
                return res.status(200).send();
            }
            catch (error) {
                next(error);
            }
        });
    }
    refresh(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = req.cookies.refresh_token;
                if (!refreshToken) {
                    throw ApiError_1.ApiError.Unauthorized();
                }
                const userData = yield userService_1.userService.refresh(refreshToken);
                res.cookie("refresh_token", userData.refreshToken, {
                    maxAge: 15 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    sameSite: true,
                });
                return res.json(userData);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield userService_1.userService.getAllUsers();
                res.json(users);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.userController = new UserController();
