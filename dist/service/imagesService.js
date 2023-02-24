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
exports.imagesService = void 0;
const yandexCloud_1 = require("../utils/yandexCloud");
class ImagesService {
    upload(imageBase64, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const buf = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ""), "base64");
            const type = imageBase64.split(";")[0].split("/")[1];
            const fileName = `${name}.${type}`;
            return yield yandexCloud_1.yandexCloud.upload({
                file: buf,
                path: "images",
                contentType: `image/${type}`,
                fileName,
            });
        });
    }
}
exports.imagesService = new ImagesService();
