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
exports.yandexCloud = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
class YandexCloud {
    constructor() {
        this.upload = ({ file, path, fileName, contentType }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const filePath = `${path}/${fileName}`;
                const bucketName = "course-project";
                const params = {
                    Bucket: bucketName,
                    Key: filePath,
                    Body: file,
                    ContentType: contentType,
                    ContentEncoding: "base64",
                };
                const result = yield new Promise((resolve, reject) => {
                    this.aws.send(new client_s3_1.PutObjectCommand(params)).then((data) => {
                        console.log(data);
                        resolve(data);
                    }, (error) => {
                        console.log(error);
                        reject(error);
                    });
                });
                return `https://storage.yandexcloud.net/${bucketName}/${filePath}`;
            }
            catch (e) {
                console.error(e);
            }
        });
        this.aws = new client_s3_1.S3Client({
            endpoint: "https://storage.yandexcloud.net",
            credentials: {
                accessKeyId: process.env.YDB_KEY_IDENTIFIER,
                secretAccessKey: process.env.YDB_KEY,
            },
            region: "ru-central1",
            // httpOptions: {
            //   timeout: 10000,
            //   connectTimeout: 10000,
            // },
        });
    }
}
exports.yandexCloud = new YandexCloud();
