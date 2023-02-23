"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = exports.errorHandler = exports.notFound = void 0;
const ApiError_1 = require("./exceptions/ApiError");
const tokenService_1 = require("./service/tokenService");
function notFound(req, res, next) {
    res.status(404);
    const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
    next(error);
}
exports.notFound = notFound;
function errorHandler(err, req, res, next) {
    console.error(err);
    if (err instanceof ApiError_1.ApiError) {
        return res
            .status(err.status)
            .json({ message: err.message, errors: err.errors });
    }
    return res.status(500).json({ message: "Unexpected error" });
}
exports.errorHandler = errorHandler;
function isAuthenticated(req, res, next) {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return next(ApiError_1.ApiError.Unauthorized());
        }
        const token = authorization.split(" ")[1];
        if (!token) {
            return next(ApiError_1.ApiError.Unauthorized());
        }
        const userData = tokenService_1.tokenService.validateAccessToken(token);
        if (!userData) {
            return next(ApiError_1.ApiError.Unauthorized());
        }
        req.user = userData;
    }
    catch (err) {
        return next(ApiError_1.ApiError.Unauthorized());
    }
    return next();
}
exports.isAuthenticated = isAuthenticated;
