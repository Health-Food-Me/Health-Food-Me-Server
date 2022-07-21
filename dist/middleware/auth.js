"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winstonConfig_1 = require("../config/winstonConfig");
const User_1 = __importDefault(require("../models/User"));
const BaseResponse_1 = __importDefault(require("../modules/BaseResponse"));
const exceptionMessage_1 = __importDefault(require("../modules/exceptionMessage"));
const jwtHandler_1 = __importDefault(require("../modules/jwtHandler"));
const responseMessage_1 = __importDefault(require("../modules/responseMessage"));
const statusCode_1 = __importDefault(require("../modules/statusCode"));
exports.default = (req, res, next) => {
    const token = req.headers.token;
    if (!token) {
        return res
            .status(statusCode_1.default.UNAUTHORIZED)
            .send(BaseResponse_1.default.failure(statusCode_1.default.UNAUTHORIZED, responseMessage_1.default.NULL_VALUE_TOKEN));
    }
    try {
        const decoded = jwtHandler_1.default.verify(token);
        if (decoded === exceptionMessage_1.default.TOKEN_EXPIRED) {
            return res
                .status(statusCode_1.default.UNAUTHORIZED)
                .send(BaseResponse_1.default.failure(statusCode_1.default.UNAUTHORIZED, responseMessage_1.default.EXPIRED_TOKEN));
        }
        if (decoded === exceptionMessage_1.default.TOKEN_INVALID) {
            return res
                .status(statusCode_1.default.FORBIDDEN)
                .send(BaseResponse_1.default.failure(statusCode_1.default.FORBIDDEN, responseMessage_1.default.INVALID_TOKEN));
        }
        const userId = decoded.id;
        if (!userId) {
            return res
                .status(statusCode_1.default.FORBIDDEN)
                .send(BaseResponse_1.default.failure(statusCode_1.default.FORBIDDEN, responseMessage_1.default.INVALID_TOKEN));
        }
        const user = User_1.default.findById(userId);
        if (!user) {
            return res
                .status(statusCode_1.default.UNAUTHORIZED)
                .send(BaseResponse_1.default.failure(statusCode_1.default.UNAUTHORIZED, responseMessage_1.default.NO_USER));
        }
        req.body.user = user;
        next();
    }
    catch (error) {
        winstonConfig_1.logger.e("middleware/auth.ts error", error);
        res
            .status(statusCode_1.default.INTERNAL_SERVER_ERROR)
            .send(BaseResponse_1.default.failure(statusCode_1.default.INTERNAL_SERVER_ERROR, responseMessage_1.default.INTERNAL_SERVER_ERROR));
    }
};
//# sourceMappingURL=auth.js.map