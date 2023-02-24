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
exports.menuController = void 0;
const ApiError_1 = require("../exceptions/ApiError");
const express_validator_1 = require("express-validator");
const menuService_1 = require("../service/menuService");
class MenuController {
    create(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return next(ApiError_1.ApiError.BadRequest("Validation error", errors.array()));
                }
                const { title, description, image } = req.body;
                const menu = yield menuService_1.menuService.createMenu((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, title, description, image);
                res.json(menu);
            }
            catch (error) {
                next(error);
            }
        });
    }
    get(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const menus = yield menuService_1.menuService.get((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
                res.json(menus);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.menuController = new MenuController();
