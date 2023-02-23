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
exports.noteController = void 0;
const ApiError_1 = require("../exceptions/ApiError");
const express_validator_1 = require("express-validator");
const noteService_1 = require("../service/noteService");
class NoteController {
    getNoteNames(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { search } = req.query;
                const noteNames = yield noteService_1.noteService.getNoteNames((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, search);
                res.json(noteNames);
            }
            catch (error) {
                next(error);
            }
        });
    }
    createNote(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return next(ApiError_1.ApiError.BadRequest("Validation error", errors.array()));
                }
                const { id, title } = req.body;
                const note = yield noteService_1.noteService.createNote((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, id, title);
                res.json(note);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getNote(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                if (typeof id !== "string") {
                    throw ApiError_1.ApiError.BadRequest("bla");
                }
                const note = yield noteService_1.noteService.getNote(id);
                res.json(note);
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateNote(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, updates } = req.body;
                const note = yield noteService_1.noteService.updateNote(id, updates);
                res.json(note);
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteNote(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                if (typeof id !== "string") {
                    throw ApiError_1.ApiError.BadRequest("bla");
                }
                const note = yield noteService_1.noteService.deleteNote(id);
                res.json(note);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.noteController = new NoteController();
