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
exports.noteService = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
class NoteService {
    getNoteNames(userId, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const noteNames = yield prisma_1.default.note.findMany({
                where: {
                    userId,
                    text: {
                        search,
                    },
                },
                select: {
                    id: true,
                    title: true,
                },
                orderBy: {
                    place: "desc",
                },
            });
            return noteNames;
        });
    }
    createNote(userId, id, title) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const lastNotePlace = yield prisma_1.default.note.findMany({
                where: { userId },
                select: { place: true },
                orderBy: { place: "asc" },
                take: -1,
            });
            const newPlace = typeof ((_a = lastNotePlace[0]) === null || _a === void 0 ? void 0 : _a.place) === "number"
                ? lastNotePlace[0].place + 1
                : 0;
            const note = yield prisma_1.default.note.create({
                data: {
                    id,
                    userId,
                    place: newPlace,
                    title,
                    text: "",
                },
            });
            return note;
        });
    }
    getNote(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const note = yield prisma_1.default.note.findUnique({
                where: {
                    id,
                },
            });
            return note;
        });
    }
    updateNote(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            const note = yield prisma_1.default.note.update({
                where: { id },
                data: updates,
            });
            return note;
        });
    }
    deleteNote(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const note = yield prisma_1.default.note.delete({
                where: { id },
            });
            return note;
        });
    }
}
exports.noteService = new NoteService();
