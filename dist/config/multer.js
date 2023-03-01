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
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const _1 = __importDefault(require("."));
const s3Config_1 = __importDefault(require("./s3Config"));
const winstonConfig_1 = require("./winstonConfig");
// 미들웨어로 사용할 multer 생성
const upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3Config_1.default,
        bucket: `${_1.default.bucketName}/review`,
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        acl: "public-read",
        key: function (req, file, cb) {
            file.originalname = `${Date.now()}_${file.originalname}`;
            cb(null, file.originalname);
        },
    }),
});
const s3Delete = (key) => __awaiter(void 0, void 0, void 0, function* () {
    s3Config_1.default.deleteObject({
        Bucket: _1.default.bucketName,
        Key: key,
    }, (err) => {
        if (err)
            throw err;
        winstonConfig_1.logger.e(err);
    });
});
exports.default = {
    upload,
    s3Delete,
};
//# sourceMappingURL=multer.js.map