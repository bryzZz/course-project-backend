"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const middlewares_1 = require("./middlewares");
const router_1 = __importDefault(require("./router"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ credentials: true, origin: process.env.CLIENT_URL }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/v1", router_1.default);
app.use(middlewares_1.notFound);
app.use(middlewares_1.errorHandler);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Listening: http://localhost:${PORT}`);
});
