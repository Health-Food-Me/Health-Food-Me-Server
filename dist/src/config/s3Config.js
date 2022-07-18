"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const _1 = __importDefault(require("."));
const storage = new aws_sdk_1.default.S3({
    accessKeyId: _1.default.s3AccessKey,
    secretAccessKey: _1.default.s3SecretKey,
    region: "ap-northeast-2",
});
exports.default = storage;
//# sourceMappingURL=s3Config.js.map