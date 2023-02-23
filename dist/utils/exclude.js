"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exclude = void 0;
function exclude(obj, keys) {
    for (let key of keys) {
        delete obj[key];
    }
    return obj;
}
exports.exclude = exclude;
