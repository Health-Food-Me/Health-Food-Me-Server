"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const winstonConfig_1 = require("../config/winstonConfig");
const exceptionMessage_1 = __importDefault(require("./exceptionMessage"));
const sign = (userId, email) => {
    const payload = {
        id: userId,
        email: email,
    };
    const accessToken = jsonwebtoken_1.default.sign(payload, config_1.default.jwtSecret, { expiresIn: "1h" });
    return accessToken;
};
const createRefresh = () => {
    const refreshToken = jsonwebtoken_1.default.sign({}, config_1.default.jwtSecret, { expiresIn: "14d" });
    return refreshToken;
};
const verify = (token) => {
    try {
        console.log(token);
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
        return decoded;
    }
    catch (error) {
        if (error.message === "jwt expired") {
            winstonConfig_1.logger.e("만료된 토큰입니다.", error);
            return exceptionMessage_1.default.TOKEN_EXPIRED;
        }
        if (error.message === "invalid signature") {
            winstonConfig_1.logger.e("유효하지 않은 토큰입니다.", error);
            return exceptionMessage_1.default.TOKEN_INVALID;
        }
        winstonConfig_1.logger.e("유효하지 않은 토큰입니다.", error);
        return exceptionMessage_1.default.TOKEN_INVALID;
    }
};
exports.default = {
    sign,
    createRefresh,
    verify,
};
//# sourceMappingURL=jwtHandler.js.map